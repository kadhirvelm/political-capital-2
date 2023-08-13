/**
 * Copyright (c) 2022 - KM
 */

import {
    ALL_RESOLUTIONS,
    getPayoutPerResolutionModifier,
    getTimeBetweenResolutionsModifier,
    getTimePerResolutionModifier,
    IActiveResolutionRid,
    IBasicResolution,
    IEvent,
    IGameClock,
    IPassedGameModifier,
    IPossibleEvent,
    ITallyResolution,
    TIME_BETWEEN_RESOLUTIONS_IN_DAYS,
    TIME_FOR_EACH_RESOLUTION_IN_DAYS,
    TOTAL_DAYS_IN_GAME,
} from "@pc2/api";
import {
    ActivePlayer,
    ActiveResolution,
    ActiveResolutionVote,
    GameState,
    PassedGameModifier,
    ResolveGameEvent,
} from "@pc2/distributed-compute";
import _ from "lodash";
import { Op } from "sequelize";
import { v4 } from "uuid";

export function getCurrentStage(gameClock: IGameClock, totalResolutions: number): IBasicResolution["stage"] {
    if (totalResolutions === 4) {
        return "middle";
    }

    if (gameClock < TOTAL_DAYS_IN_GAME * 0.4) {
        return "early";
    }

    return "late";
}

function updatePoliticalCapitalPayout(
    randomResolution: IBasicResolution,
    totalPlayers: number,
    passedGameModifiers: IPassedGameModifier[],
): IBasicResolution {
    const finalResolution = { ...randomResolution };

    const totalBasePayout = finalResolution.politicalCapitalPayout * totalPlayers;
    const accountForModifier = totalBasePayout * getPayoutPerResolutionModifier(passedGameModifiers);

    finalResolution.politicalCapitalPayout = accountForModifier;

    return finalResolution;
}

async function createNewResolution(gameState: GameState, passedGameModifiers: IPassedGameModifier[]) {
    const [existingResolutions, activePlayers] = await Promise.all([
        ActiveResolution.findAll({ where: { gameStateRid: gameState.gameStateRid } }),
        ActivePlayer.findAll({ where: { gameStateRid: gameState.gameStateRid } }),
    ]);

    const alreadySeenResolutions = existingResolutions.map((resolution) => resolution.resolutionDetails.title);

    const currentStage = getCurrentStage(gameState.gameClock, existingResolutions.length);
    const allowedResolutions = ALL_RESOLUTIONS.filter((resolution) => {
        return !alreadySeenResolutions.includes(resolution.title) && resolution.stage === currentStage;
    });
    const randomResolution = _.sample(allowedResolutions);

    if (randomResolution === undefined) {
        // eslint-disable-next-line no-console
        console.error("Could not find a resolution to provide.");
        return Promise.resolve({});
    }

    const resolutionWithUpdatedPayout = updatePoliticalCapitalPayout(
        randomResolution,
        activePlayers.length,
        passedGameModifiers,
    );

    const activeResolutionRid = v4() as IActiveResolutionRid;

    const timePerResolutionModifier = getTimePerResolutionModifier(passedGameModifiers);
    const finalTimePerResolution = Math.max(TIME_FOR_EACH_RESOLUTION_IN_DAYS * timePerResolutionModifier, 5);

    return Promise.all([
        ActiveResolution.create({
            gameStateRid: gameState.gameStateRid,
            activeResolutionRid,
            resolutionDetails: resolutionWithUpdatedPayout,
            state: "active",
            createdOn: gameState.gameClock,
        }),
        ResolveGameEvent.create({
            gameStateRid: gameState.gameStateRid,
            resolvesOn: (gameState.gameClock + finalTimePerResolution) as IGameClock,
            eventDetails: { type: "tally-resolution", activeResolutionRid },
            state: "active",
        }),
    ]);
}

async function resolveResolution(
    gameState: GameState,
    tallyResolution: ITallyResolution,
    passedGameModifiers: IPassedGameModifier[],
) {
    const [activeResolution, allActiveVotes] = await Promise.all([
        ActiveResolution.findOne({ where: { activeResolutionRid: tallyResolution.activeResolutionRid } }),
        ActiveResolutionVote.findAll({
            where: { activeResolutionRid: tallyResolution.activeResolutionRid },
        }),
    ]);
    if (activeResolution == null) {
        return;
    }

    const passedVotes = allActiveVotes.filter((vote) => vote.vote === "passed");
    const failedVotes = allActiveVotes.filter((vote) => vote.vote === "failed");

    if (passedVotes > failedVotes) {
        activeResolution.state = "passed";
    } else {
        activeResolution.state = "failed";
    }

    const timePerResolutionModifier = getTimePerResolutionModifier(passedGameModifiers);
    const finalTimePerResolution = Math.round(
        Math.max(TIME_FOR_EACH_RESOLUTION_IN_DAYS * timePerResolutionModifier, 5),
    );

    const timeBetweenResolutionsModifier = getTimeBetweenResolutionsModifier(passedGameModifiers);
    const finalTimeBetweenResolutions = Math.round(
        Math.max(TIME_BETWEEN_RESOLUTIONS_IN_DAYS * timeBetweenResolutionsModifier, 1),
    );

    const timeForAnotherResolution =
        gameState.gameClock + finalTimePerResolution + finalTimeBetweenResolutions < TOTAL_DAYS_IN_GAME;

    await Promise.all([
        // Update the resolution state
        activeResolution.save(),
        // Optionally create a new game modifier
        activeResolution.state === "passed" && activeResolution.resolutionDetails.gameModifier !== undefined
            ? PassedGameModifier.create({
                  gameStateRid: gameState.gameStateRid,
                  fromActiveResolutionRid: activeResolution.activeResolutionRid,
                  modifier: activeResolution.resolutionDetails.gameModifier,
                  createdOn: gameState.gameClock,
              })
            : Promise.resolve({}),
        // If time permits, create a new resolution
        timeForAnotherResolution
            ? ResolveGameEvent.create({
                  gameStateRid: gameState.gameStateRid,
                  resolvesOn: (gameState.gameClock + finalTimeBetweenResolutions) as IGameClock,
                  eventDetails: { type: "new-resolution" },
                  state: "active",
              })
            : Promise.resolve({}),
    ]);
}

export async function resolveGameEvents(gameState: GameState) {
    const gameEventTypes: IPossibleEvent["type"][] = ["new-resolution", "tally-resolution"];
    const [gameEvents, passedGameModifiers] = await Promise.all([
        ResolveGameEvent.findAll({
            where: {
                gameStateRid: gameState.gameStateRid,
                eventDetails: { type: { [Op.in]: gameEventTypes } },
                resolvesOn: gameState.gameClock,
                state: "active",
            },
        }),
        PassedGameModifier.findAll({ where: { gameStateRid: gameState.gameStateRid } }),
    ]);

    const completeEvent = (gameEvent: ResolveGameEvent) => {
        gameEvent.state = "complete";
        return gameEvent.save();
    };

    await Promise.all(
        gameEvents.map((gameEvent) => {
            return IEvent.visit<Promise<any>>(gameEvent.eventDetails, {
                finishHiringStaffer: () => Promise.resolve({}),
                startHiringStaffer: () => Promise.resolve({}),
                finishTrainingStaffer: () => Promise.resolve({}),
                startTrainingStaffer: () => Promise.resolve({}),
                payoutEarlyVoting: () => Promise.resolve({}),
                newResolution: () => {
                    return Promise.all([createNewResolution(gameState, passedGameModifiers), completeEvent(gameEvent)]);
                },
                tallyResolution: (tallyResolution) => {
                    return Promise.all([
                        resolveResolution(gameState, tallyResolution, passedGameModifiers),
                        completeEvent(gameEvent),
                    ]);
                },
                unknown: () => Promise.resolve({}),
            });
        }),
    );
}

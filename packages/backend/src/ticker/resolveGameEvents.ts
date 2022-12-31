/**
 * Copyright (c) 2022 - KM
 */

import { ALL_RESOLUTIONS, IActiveResolutionRid, IEvent, IGameClock, IPossibleEvent, ITallyResolution } from "@pc2/api";
import {
    ActiveResolution,
    ActiveResolutionVote,
    GameState,
    PassedGameModifier,
    ResolveGameEvent,
} from "@pc2/distributed-compute";
import { Op } from "sequelize";
import {
    TIME_BETWEEN_RESOLUTIONS_IN_DAYS,
    TIME_FOR_EACH_RESOLUTION_IN_DAYS,
    TOTAL_DAYS_IN_GAME,
} from "../constants/game";
import _ from "lodash";
import { v4 } from "uuid";

async function createNewResolution(gameState: GameState) {
    const existingResolutions = await ActiveResolution.findAll({ where: { gameStateRid: gameState.gameStateRid } });

    const alreadySeenResolutions = existingResolutions.map((resolution) => resolution.resolutionDetails.title);

    // TODO: filter based on the stage
    const allowedResolutions = ALL_RESOLUTIONS.filter((resolution) => {
        return !alreadySeenResolutions.includes(resolution.title);
    });
    const randomResolution = _.sample(allowedResolutions);

    if (randomResolution === undefined) {
        // eslint-disable-next-line no-console
        console.error("Could not find a resolution to provide.");
        return Promise.resolve({});
    }

    const activeResolutionRid = v4() as IActiveResolutionRid;

    return Promise.all([
        ActiveResolution.create({
            gameStateRid: gameState.gameStateRid,
            activeResolutionRid,
            resolutionDetails: randomResolution,
            state: "active",
            createdOn: gameState.gameClock,
        }),
        ResolveGameEvent.create({
            gameStateRid: gameState.gameStateRid,
            resolvesOn: (gameState.gameClock + TIME_FOR_EACH_RESOLUTION_IN_DAYS) as IGameClock,
            eventDetails: { type: "tally-resolution", activeResolutionRid },
            state: "active",
        }),
    ]);
}

async function resolveResolution(gameState: GameState, tallyResolution: ITallyResolution) {
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

    const timeForAnotherResolution =
        gameState.gameClock + TIME_FOR_EACH_RESOLUTION_IN_DAYS + TIME_BETWEEN_RESOLUTIONS_IN_DAYS < TOTAL_DAYS_IN_GAME;

    await Promise.all([
        // Update the resolution state
        activeResolution.save(),
        // Optionally create a new game modifier
        activeResolution.state === "passed" && activeResolution.resolutionDetails.gameModifier !== undefined
            ? PassedGameModifier.create({
                  gameStateRid: gameState.gameStateRid,
                  modifier: activeResolution.resolutionDetails.gameModifier,
              })
            : Promise.resolve({}),
        // If time permits, create a new resolution
        timeForAnotherResolution
            ? ResolveGameEvent.create({
                  gameStateRid: gameState.gameStateRid,
                  resolvesOn: (gameState.gameClock + TIME_BETWEEN_RESOLUTIONS_IN_DAYS) as IGameClock,
                  eventDetails: { type: "new-resolution" },
                  state: "active",
              })
            : Promise.resolve({}),
    ]);
}

export async function resolveGameEvents(gameState: GameState) {
    const gameEventTypes: IPossibleEvent["type"][] = ["new-resolution", "tally-resolution"];
    const gameEvents = await ResolveGameEvent.findAll({
        where: {
            gameStateRid: gameState.gameStateRid,
            eventDetails: { type: { [Op.in]: gameEventTypes } },
            resolvesOn: gameState.gameClock,
            state: "active",
        },
    });

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
                newResolution: () => {
                    return Promise.all([createNewResolution(gameState), completeEvent(gameEvent)]);
                },
                tallyResolution: (tallyResolution) => {
                    return Promise.all([resolveResolution(gameState, tallyResolution), completeEvent(gameEvent)]);
                },
                unknown: () => Promise.resolve({}),
            });
        }),
    );
}

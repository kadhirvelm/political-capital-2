/**
 * Copyright (c) 2022 - KM
 */

import { IEvent, IGameClock, IPossibleEvent, ITallyResolution } from "@pc2/api";
import { ActiveResolution, ActiveResolutionVote, GameState, ResolveGameEvent } from "@pc2/distributed-compute";
import {
    TIME_BETWEEN_RESOLUTIONS_IN_DAYS,
    TIME_FOR_EACH_RESOLUTION_IN_DAYS,
    TOTAL_DAYS_IN_GAME,
} from "../constants/game";

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
        activeResolution.save(),
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
            eventDetails: { type: gameEventTypes },
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
                newResolution: () => Promise.resolve({}),
                tallyResolution: (tallyResolution) => {
                    return Promise.all([resolveResolution(gameState, tallyResolution), completeEvent(gameEvent)]);
                },
                unknown: () => Promise.resolve({}),
            });
        }),
    );
}

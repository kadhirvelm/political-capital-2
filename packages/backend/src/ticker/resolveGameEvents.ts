/**
 * Copyright (c) 2022 - KM
 */

import { IEvent, IPossibleEvent, ITallyResolution } from "@pc2/api";
import { ActiveResolution, ActiveResolutionVote, GameState, ResolveGameEvent } from "@pc2/distributed-compute";
import { Op } from "sequelize";

async function resolveResolution(tallyResolution: ITallyResolution) {
    const [activeResolution, allActiveVotes] = await Promise.all([
        ActiveResolution.findOne({ where: { activeResolutionRid: tallyResolution.activeResolutionRid } }),
        ActiveResolutionVote.findAll({
            where: { activeResolutionRid: tallyResolution.activeResolutionRid },
        }),
    ]);
    if (activeResolution == null) {
        return;
    }

    const votesInFavor = allActiveVotes.filter((vote) => vote.vote === "inFavor");
    const votesAgainst = allActiveVotes.filter((vote) => vote.vote === "against");

    if (votesInFavor > votesAgainst) {
        activeResolution.state = "passed";
    } else {
        activeResolution.state = "failed";
    }

    await activeResolution.save();

    // TODO: conditionally create new resolution event
}

export async function resolveGameEvents(gameState: GameState) {
    const gameEventTypes: IPossibleEvent["type"][] = ["new-resolution", "tally-resolution"];
    const gameEvents = await ResolveGameEvent.findAll({
        where: {
            gameStateRid: gameState.gameStateRid,
            eventDetails: { type: gameEventTypes },
            resolvesOn: { [Op.lte]: gameState.gameClock },
            state: "active",
        },
    });

    await Promise.all(
        gameEvents.map((gameEvent) => {
            return IEvent.visit<Promise<any>>(gameEvent.eventDetails, {
                finishHiringStaffer: () => Promise.resolve({}),
                startHiringStaffer: () => Promise.resolve({}),
                newResolution: () => Promise.resolve({}),
                tallyResolution: (tallyResolution) => {
                    return resolveResolution(tallyResolution);
                },
                unknown: () => Promise.resolve({}),
            });
        }),
    );
}

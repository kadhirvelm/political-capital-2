/**
 * Copyright (c) 2022 - KM
 */

import {
    IActiveResolution,
    IActiveStaffer,
    IEvent,
    IFullGameState,
    IPlayerRid,
    isRecruit,
    isTrainer,
    isVoter,
} from "@pc2/api";
import { IResolvedGameModifiers } from "../selectors/gameModifiers";
import { IUserFacingIndexedResolveEvents } from "../store/gameState";
import { getEffectivenessNumber } from "./gameModifiers";

export function isStafferBusy(
    staffer: IActiveStaffer,
    resolveEvents: IUserFacingIndexedResolveEvents | undefined,
    playerRid: IPlayerRid | undefined,
    fullGameState: IFullGameState | undefined,
    activeResolution: IActiveResolution | undefined,
    gameModifiers: IResolvedGameModifiers,
): boolean {
    if (playerRid === undefined) {
        return false;
    }

    if (staffer.state === "disabled") {
        return true;
    }

    const activeEvents =
        resolveEvents?.players[playerRid]?.staffers[staffer.activeStafferRid]?.filter(
            (event) => event.state === "active" || event.state === "pending",
        ) ?? [];

    const hasActiveEvent = activeEvents.length > 0;

    if (isRecruit(staffer) || isTrainer(staffer)) {
        const totalEffectiveness = getEffectivenessNumber(gameModifiers, staffer.stafferDetails.type);
        const relevantActiveEvents = activeEvents.filter(
            (event) =>
                IEvent.isStartHireStaffer(event.eventDetails) ||
                IEvent.isFinishHiringStaffer(event.eventDetails) ||
                IEvent.isStartTrainingStaffer(event.eventDetails) ||
                IEvent.isFinishTrainingStaffer(event.eventDetails),
        );

        return totalEffectiveness <= relevantActiveEvents.length;
    }

    if (isVoter(staffer) && fullGameState !== undefined && activeResolution !== undefined) {
        const totalAllowedVotes = getEffectivenessNumber(gameModifiers, staffer.stafferDetails.type);
        const maybeVotesOnThisResolution =
            fullGameState.activePlayersVotes[activeResolution.activeResolutionRid]?.[staffer.activeStafferRid];

        return totalAllowedVotes <= (maybeVotesOnThisResolution?.length ?? 0);
    }

    return hasActiveEvent;
}

/**
 * Copyright (c) 2022 - KM
 */

import {
    getTotalAllowedRecruits,
    getTotalAllowedTrainees,
    IActiveResolution,
    IActiveStaffer,
    IEvent,
    IFullGameState,
    IPlayerRid,
    isRecruit,
    isTrainer,
    isVoter,
} from "@pc2/api";
import { IUserFacingIndexedResolveEvents } from "../store/gameState";

export function isStafferBusy(
    staffer: IActiveStaffer,
    resolveEvents: IUserFacingIndexedResolveEvents | undefined,
    playerRid: IPlayerRid | undefined,
    fullGameState: IFullGameState | undefined,
    activeResolution: IActiveResolution | undefined,
): boolean {
    if (playerRid === undefined) {
        return false;
    }

    const activeEvents =
        resolveEvents?.players[playerRid]?.staffers[staffer.activeStafferRid]?.filter(
            (event) => event.state === "active" || event.state === "pending",
        ) ?? [];

    const hasActiveEvent = activeEvents.length > 0;

    if (isRecruit(staffer)) {
        const totalRecruits = getTotalAllowedRecruits(staffer);
        const hiringEvents = activeEvents.filter(
            (event) =>
                IEvent.isStartHireStaffer(event.eventDetails) || IEvent.isFinishHiringStaffer(event.eventDetails),
        );

        return totalRecruits <= hiringEvents.length || activeEvents.length - hiringEvents.length > 0;
    }

    if (isTrainer(staffer)) {
        const totalTraining = getTotalAllowedTrainees(staffer);
        const trainingEvents = activeEvents.filter(
            (event) =>
                IEvent.isStartTrainingStaffer(event.eventDetails) || IEvent.isFinishTrainingStaffer(event.eventDetails),
        );

        return totalTraining <= trainingEvents.length || activeEvents.length - trainingEvents.length > 0;
    }

    if (isVoter(staffer) && fullGameState !== undefined && activeResolution !== undefined) {
        const maybeVotesOnThisResolution =
            fullGameState.activePlayersVotes[activeResolution.activeResolutionRid]?.[staffer.activeStafferRid];

        return maybeVotesOnThisResolution !== undefined && maybeVotesOnThisResolution.length > 0;
    }

    return hasActiveEvent;
}

export function isSurfaceLevelBusy(
    staffer: IActiveStaffer,
    resolveEvents: IUserFacingIndexedResolveEvents | undefined,
    playerRid: IPlayerRid | undefined,
): boolean {
    if (playerRid === undefined) {
        return false;
    }

    const activeEvents =
        resolveEvents?.players[playerRid]?.staffers[staffer.activeStafferRid]?.filter(
            (event) => event.state === "active" || event.state === "pending",
        ) ?? [];

    const hasActiveEvent = activeEvents.length > 0;

    if (isRecruit(staffer)) {
        const hiringEvents = activeEvents.filter(
            (event) =>
                IEvent.isStartHireStaffer(event.eventDetails) || IEvent.isFinishHiringStaffer(event.eventDetails),
        );

        return activeEvents.length - hiringEvents.length > 0;
    }

    if (isTrainer(staffer)) {
        const trainingEvents = activeEvents.filter(
            (event) =>
                IEvent.isStartTrainingStaffer(event.eventDetails) || IEvent.isFinishTrainingStaffer(event.eventDetails),
        );

        return activeEvents.length - trainingEvents.length > 0;
    }

    return hasActiveEvent;
}

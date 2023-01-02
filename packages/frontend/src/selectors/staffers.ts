/**
 * Copyright (c) 2022 - KM
 */

import {
    getTotalAllowedRecruits,
    getTotalAllowedTrainees,
    getTotalAllowedVotes,
    IActiveStaffer,
    IActiveStafferRid,
    IEvent,
    IFullGameState,
    IPlayer,
    isRecruit,
    isTrainer,
    isVoter,
    StafferLadderIndex,
} from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { State } from "../store/createStore";
import { IUserFacingIndexedResolveEvents } from "../store/gameState";

export const getAvailableToTrainStaffer = (trainerRid: IActiveStafferRid) =>
    createSelector(
        (state: State) => state.localGameState.fullGameState,
        (state: State) => state.localGameState.resolveEvents,
        (state: State) => state.playerState.player,
        (
            fullGameState: IFullGameState | undefined,
            resolveEvents: IUserFacingIndexedResolveEvents | undefined,
            player: IPlayer | undefined,
        ) => {
            if (fullGameState === undefined || resolveEvents === undefined || player === undefined) {
                return [];
            }

            const hasStafferVoted = (votingStaffer: IActiveStaffer) => {
                if (!isVoter(votingStaffer)) {
                    return false;
                }

                const maybeActiveResolution = fullGameState.activeResolutions.find(
                    (resolution) => resolution.state === "active",
                );
                if (maybeActiveResolution === undefined) {
                    return false;
                }

                const maybeVotes =
                    fullGameState.activePlayersVotes[maybeActiveResolution.activeResolutionRid]?.[
                        votingStaffer.activeStafferRid
                    ] ?? [];
                return maybeVotes.length > 0;
            };

            return fullGameState.activePlayersStaffers[player.playerRid].filter((staffer) => {
                const isNotSelf = staffer.activeStafferRid !== trainerRid;
                const isNotBusy =
                    (resolveEvents.players[player.playerRid]?.staffers[staffer.activeStafferRid]?.filter(
                        (event) => event.state === "active" || event.state === "pending",
                    )?.length ?? 0) === 0;
                const hasUpgrades = (StafferLadderIndex[staffer.stafferDetails.type] ?? []).length > 0;
                const hasVoted = hasStafferVoted(staffer);

                return isNotSelf && isNotBusy && hasUpgrades && staffer.state === "active" && !hasVoted;
            });
        },
    );

export const getUnusedCapacity = createSelector(
    (state: State) => state.localGameState.fullGameState,
    (state: State) => state.localGameState.resolveEvents,
    (state: State) => state.playerState.player,
    (
        fullGameState: IFullGameState | undefined,
        resolveEvents: IUserFacingIndexedResolveEvents | undefined,
        player: IPlayer | undefined,
    ): { voting: number; training: number; hiring: number } => {
        const notifications = { voting: 0, training: 0, hiring: 0 };

        if (fullGameState === undefined || resolveEvents === undefined || player === undefined) {
            return notifications;
        }

        const currentResolution = fullGameState.activeResolutions.find((resolution) => resolution.state === "active");

        fullGameState.activePlayersStaffers[player.playerRid].forEach((staffer) => {
            if (isVoter(staffer) && currentResolution !== undefined) {
                const totalVotes = getTotalAllowedVotes(staffer);
                const castVotes =
                    fullGameState.activePlayersVotes[currentResolution.activeResolutionRid]?.[staffer.activeStafferRid]
                        ?.length ?? 0;

                // The Math.max should handle the independent voters without needing a special case
                notifications.voting += Math.max(totalVotes - castVotes, 0);
            }

            if (isRecruit(staffer)) {
                const totalRecruitCapacity = getTotalAllowedRecruits(staffer);
                const currentlyRecruiting =
                    resolveEvents.players[player.playerRid]?.staffers[staffer.activeStafferRid]?.filter(
                        (event) =>
                            (event.state === "active" || event.state === "pending") &&
                            (IEvent.isStartHireStaffer(event.eventDetails) ||
                                IEvent.isFinishHiringStaffer(event.eventDetails)),
                    ).length ?? 0;

                notifications.hiring += Math.max(totalRecruitCapacity - currentlyRecruiting, 0);
            }

            if (isTrainer(staffer)) {
                const totalTrainingCapacity = getTotalAllowedTrainees(staffer);
                const currentlyTraining =
                    resolveEvents.players[player.playerRid]?.staffers[staffer.activeStafferRid]?.filter(
                        (event) =>
                            (event.state === "active" || event.state === "pending") &&
                            (IEvent.isStartTrainingStaffer(event.eventDetails) ||
                                IEvent.isFinishTrainingStaffer(event.eventDetails)),
                    ).length ?? 0;

                notifications.training += Math.max(totalTrainingCapacity - currentlyTraining, 0);
            }
        });

        return notifications;
    },
);

/**
 * Copyright (c) 2022 - KM
 */

import {
    getTotalAllowedVotes,
    IActiveResolutionRid,
    IActiveResolutionVote,
    IActiveStaffer,
    IFullGameState,
    IPlayer,
    isVoter,
} from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { State } from "../store/createStore";
import { IUserFacingIndexedResolveEvents, IUserFacingResolveEvents } from "../store/gameState";

export interface IVoterAndActiveEvent {
    staffer: IActiveStaffer;
    activeEvent: IUserFacingResolveEvents | undefined;
}

export const getVoters = createSelector(
    (state: State) => state.playerState.player,
    (state: State) => state.localGameState.fullGameState,
    (state: State) => state.localGameState.resolveEvents,
    (
        playerState: IPlayer | undefined,
        fullGameState: IFullGameState | undefined,
        resolveEvent: IUserFacingIndexedResolveEvents | undefined,
    ): IVoterAndActiveEvent[] => {
        if (playerState === undefined || fullGameState === undefined || resolveEvent === undefined) {
            return [];
        }

        return fullGameState.activePlayersStaffers[playerState.playerRid]
            .filter((staffer) => {
                return isVoter(staffer.stafferDetails);
            })
            .map((staffer) => ({
                activeEvent: resolveEvent.players[playerState.playerRid]?.staffers[staffer.activeStafferRid]?.find(
                    (event) => event.state === "active",
                ),
                staffer,
            }))
            .slice()
            .sort((a, b) => {
                if (a.activeEvent === undefined && b.activeEvent !== undefined) {
                    return -1;
                }

                if (a.activeEvent !== undefined && b.activeEvent === undefined) {
                    return 1;
                }

                const aVotes = getTotalAllowedVotes(a.staffer);
                const bVotes = getTotalAllowedVotes(b.staffer);

                return aVotes === bVotes
                    ? a.staffer.stafferDetails.displayName.localeCompare(b.staffer.stafferDetails.displayName)
                    : aVotes > bVotes
                    ? -1
                    : 1;
            });
    },
);

export const getVotesAlreadyCast = (activeResolutionRid: IActiveResolutionRid) =>
    createSelector(
        getVoters,
        (state: State) => state.localGameState.fullGameState,
        (playerVoters: IVoterAndActiveEvent[], fullGameState: IFullGameState | undefined) => {
            if (fullGameState === undefined) {
                return [];
            }

            const alreadyCastVotes: IActiveResolutionVote[] = [];
            playerVoters.forEach((playerVoter) => {
                alreadyCastVotes.push(
                    ...(fullGameState.activePlayersVotes[activeResolutionRid]?.[playerVoter.staffer.activeStafferRid] ??
                        []),
                );
            });

            return alreadyCastVotes;
        },
    );

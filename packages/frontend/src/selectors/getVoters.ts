/**
 * Copyright (c) 2022 - KM
 */

import {
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
            }));
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

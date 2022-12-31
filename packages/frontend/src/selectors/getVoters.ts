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

export const getVoters = createSelector(
    (state: State) => state.playerState.player,
    (state: State) => state.localGameState.fullGameState,
    (playerState: IPlayer | undefined, fullGamState: IFullGameState | undefined) => {
        if (playerState === undefined || fullGamState === undefined) {
            return [];
        }

        return fullGamState.activePlayersStaffers[playerState.playerRid].filter((staffer) => {
            return isVoter(staffer.stafferDetails);
        });
    },
);

export const getVotesAlreadyCast = (activeResolutionRid: IActiveResolutionRid) =>
    createSelector(
        getVoters,
        (state: State) => state.localGameState.fullGameState,
        (playerVoters: IActiveStaffer[], fullGameState: IFullGameState | undefined) => {
            if (fullGameState === undefined) {
                return [];
            }

            const alreadyCastVotes: IActiveResolutionVote[] = [];
            playerVoters.forEach((playerVoter) => {
                alreadyCastVotes.push(
                    ...(fullGameState.activePlayersVotes[activeResolutionRid]?.[playerVoter.activeStafferRid] ?? []),
                );
            });

            return alreadyCastVotes;
        },
    );

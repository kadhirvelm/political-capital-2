/**
 * Copyright (c) 2022 - KM
 */

import { IFullGameState, IPlayer, isVoter } from "@pc2/api";
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

/**
 * Copyright (c) 2022 - KM
 */

import { IPlayer } from "@pc2/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPlayerState {
    player: IPlayer | undefined;
}

const initialState: IPlayerState = {
    player: undefined,
};

export const playerState = createSlice({
    name: "playerState",
    initialState,
    reducers: {
        setPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.player = action.payload;
        },
    },
});

export const { setPlayer } = playerState.actions;
export const PlayerStateReducer = playerState.reducer;

/**
 * Copyright (c) 2022 - KM
 */

import { IPlayer } from "@pc2/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPlayerState {
    player: IPlayer | undefined;
    isConnectedToServer: boolean;
}

const initialState: IPlayerState = {
    player: undefined,
    isConnectedToServer: false,
};

export const playerState = createSlice({
    name: "playerState",
    initialState,
    reducers: {
        isConnectedToServer: (state) => {
            state.isConnectedToServer = true;
        },
        disconnectedFromServer: (state) => {
            state.isConnectedToServer = false;
        },
        setPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.player = action.payload;
        },
    },
});

export const { isConnectedToServer, disconnectedFromServer, setPlayer } = playerState.actions;
export const PlayerStateReducer = playerState.reducer;

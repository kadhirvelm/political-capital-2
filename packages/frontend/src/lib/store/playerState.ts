/*
 * Copyright 2023 KM.
 */

import { type IPlayer } from "@pc2/api";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IPlayerState {
  isConnectedToServer: boolean;
  player: IPlayer | undefined;
}

const initialState: IPlayerState = {
  isConnectedToServer: false,
  player: undefined,
};

export const playerState = createSlice({
  initialState,
  name: "playerState",
  reducers: {
    disconnectedFromServer: (state) => {
      state.isConnectedToServer = false;
    },
    isConnectedToServer: (state) => {
      state.isConnectedToServer = true;
    },
    setPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.player = action.payload;
    },
  },
});

export const { isConnectedToServer, disconnectedFromServer, setPlayer } = playerState.actions;
export const PlayerStateReducer = playerState.reducer;

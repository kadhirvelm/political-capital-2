/**
 * Copyright (c) 2022 - KM
 */

import { IFullGameState, IPossibleToPlayerMessages, IToPlayerMessages } from "@pc2/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILocalGameState {
    fullGameState: IFullGameState | undefined;
}

const initialState: ILocalGameState = {
    fullGameState: undefined,
};

const gameState = createSlice({
    name: "gameState",
    initialState,
    reducers: {
        handleGameMessage: (state, action: PayloadAction<IPossibleToPlayerMessages>) => {
            IToPlayerMessages.visit(action.payload, {
                updateGameState: ({ newGameState }) => {
                    state.fullGameState = newGameState;
                },
                unknown: () => {},
            });
        },
        setGameState: (state, action: PayloadAction<IFullGameState>) => {
            state.fullGameState = action.payload;
        },
    },
});

export const { handleGameMessage, setGameState } = gameState.actions;
export const LocalGameStateReducer = gameState.reducer;

/**
 * Copyright (c) 2022 - KM
 */

import { configureStore } from "@reduxjs/toolkit";
import { ILocalGameState, LocalGameStateReducer } from "./gameState";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { PlayerStateReducer } from "./playerState";

export interface IStore {
    localGameState: ILocalGameState;
}

export const Store = configureStore({
    reducer: {
        localGameState: LocalGameStateReducer,
        playerState: PlayerStateReducer,
    },
});

export type State = ReturnType<typeof Store.getState>;
export type Dispatch = typeof Store.dispatch;

export const usePoliticalCapitalDispatch: () => Dispatch = useDispatch;
export const usePoliticalCapitalSelector: TypedUseSelectorHook<State> = useSelector;

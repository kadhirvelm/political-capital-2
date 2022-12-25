/**
 * Copyright (c) 2022 - KM
 */

import { configureStore , AnyAction, Dispatch as D, MiddlewareAPI, ThunkDispatch } from "@reduxjs/toolkit";
import { ILocalGameState, LocalGameStateReducer } from "./gameState";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { PlayerStateReducer } from "./playerState";

export interface IStore {
    localGameState: ILocalGameState;
}

const LoggingMiddleware = <Reducers>() => [
    (store: MiddlewareAPI<ThunkDispatch<Reducers, null, AnyAction>, Reducers>) =>
        (next: D<AnyAction>) =>
        (action: any) => {
            if (process.env.NODE_ENV === "production") {
                return next(action);
            }

            const result = next(action);
            console.log(`%c ${action.type}`, "color: #cacfd2", {
                action,
                nextState: store.getState(),
            });

            return result;
        },
];

export const Store = configureStore({
    reducer: {
        localGameState: LocalGameStateReducer,
        playerState: PlayerStateReducer,
    },
    middleware: LoggingMiddleware,
});

export type State = ReturnType<typeof Store.getState>;
export type Dispatch = typeof Store.dispatch;

export const usePoliticalCapitalDispatch: () => Dispatch = useDispatch;
export const usePoliticalCapitalSelector: TypedUseSelectorHook<State> = useSelector;

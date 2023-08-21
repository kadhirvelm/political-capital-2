/*
 * Copyright 2023 KM.
 */

import {
  configureStore,
  type AnyAction,
  type Dispatch as D,
  type MiddlewareAPI,
  type ThunkDispatch,
} from "@reduxjs/toolkit";
import { type ILocalGameState, LocalGameStateReducer } from "./gameState";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { PlayerStateReducer } from "./playerState";

export interface IStore {
  localGameState: ILocalGameState;
}

const LoggingMiddleware = <Reducers>() => [
  (store: MiddlewareAPI<ThunkDispatch<Reducers, null, AnyAction>, Reducers>) =>
    (next: D<AnyAction>) =>
    (action: AnyAction) => {
      if (process.env.NODE_ENV === "production") {
        return next(action);
      }

      const result = next(action);
      // eslint-disable-next-line no-console
      console.log(`%c ${action.type}`, "color: #cacfd2", {
        action,
        nextState: store.getState(),
      });

      return result;
    },
];

export const Store = configureStore({
  devTools: true,
  middleware: LoggingMiddleware,
  reducer: {
    localGameState: LocalGameStateReducer,
    playerState: PlayerStateReducer,
  },
});

export type State = ReturnType<typeof Store.getState>;
export type Dispatch = typeof Store.dispatch;

export const usePoliticalCapitalDispatch: () => Dispatch = useDispatch;
export const usePoliticalCapitalSelector: TypedUseSelectorHook<State> = useSelector;

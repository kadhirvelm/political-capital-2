/*
 * Copyright 2023 KM.
 */

import {
  type IActiveNotification,
  type IActiveResolutionVote,
  type IActiveStafferRid,
  type IFullGameState,
  type IPartialResolveGameEvent,
  type IPlayerRid,
  type IPossibleEvent,
  type IPossibleToPlayerMessages,
  type IResolveGameEvent,
  ToPlayerMessages,
} from "@pc2/api";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export type IUserFacingResolveEvents = IResolveGameEvent | IPartialResolveGameEvent<IPossibleEvent>;

export const isResolveGameEvent = (event: IUserFacingResolveEvents): event is IResolveGameEvent => {
  return (event as IResolveGameEvent).resolvesOn !== undefined && event.state !== "pending";
};

export interface IUserFacingIndexedResolveEvents {
  game: IResolveGameEvent[];
  players: {
    [playerRid: IPlayerRid]: {
      overall: IResolveGameEvent[];
      staffers: {
        [stafferRid: IActiveStafferRid]: IUserFacingResolveEvents[];
      };
    };
  };
}

export interface ILocalGameState {
  fullGameState: IFullGameState | undefined;
  notifications: IActiveNotification[];
  resolveEvents: IUserFacingIndexedResolveEvents | undefined;
  viewingNotifications: IActiveNotification[];
}

const initialState: ILocalGameState = {
  fullGameState: undefined,
  notifications: [],
  resolveEvents: undefined,
  viewingNotifications: [],
};

const gameState = createSlice({
  initialState,
  name: "gameState",
  reducers: {
    addGameEventToStaffer: (
      state,
      action: PayloadAction<{
        activeStafferRid: IActiveStafferRid;
        playerRid: IPlayerRid;
        resolveGameEvent: IPartialResolveGameEvent<IPossibleEvent>;
      }>,
    ) => {
      if (state.resolveEvents === undefined) {
        return state;
      }

      const { playerRid, activeStafferRid, resolveGameEvent } = action.payload;
      state.resolveEvents.players[playerRid] = {
        overall: state.resolveEvents.players[playerRid]?.overall ?? [],
        staffers: state.resolveEvents.players[playerRid]?.staffers ?? {},
      };
      state.resolveEvents.players[playerRid].staffers[activeStafferRid] =
        [...(state.resolveEvents.players[playerRid].staffers[activeStafferRid] ?? [])] ?? [];

      // We need to get the reference to change at this level
      state.resolveEvents.players[playerRid].staffers[activeStafferRid] = [
        ...state.resolveEvents.players[playerRid].staffers[activeStafferRid],
        resolveGameEvent,
      ];
    },
    addVotes: (state, action: PayloadAction<IActiveResolutionVote[]>) => {
      if (state.fullGameState === undefined) {
        return state;
      }

      for (const vote of action.payload) {
        state.fullGameState!.activePlayersVotes[vote.activeResolutionRid] =
          state.fullGameState?.activePlayersVotes[vote.activeResolutionRid] ?? {};
        state.fullGameState!.activePlayersVotes[vote.activeResolutionRid][vote.activeStafferRid] =
          state.fullGameState!.activePlayersVotes[vote.activeResolutionRid][vote.activeStafferRid] ?? [];

        state.fullGameState!.activePlayersVotes[vote.activeResolutionRid][vote.activeStafferRid].push(vote);
      }
    },
    handleGameMessage: (state, action: PayloadAction<IPossibleToPlayerMessages>) => {
      ToPlayerMessages.visit(action.payload, {
        receiveNotification: ({ notification }) => {
          state.notifications.push(notification);
        },
        unknown: () => {},
        updateGameState: ({ newGameState }) => {
          state.fullGameState = newGameState;
          state.resolveEvents = newGameState.resolveEvents;
        },
      });
    },
    markNotificationAsRead: (state, action: PayloadAction<IActiveNotification>) => {
      const index = state.notifications.findIndex(
        (n) => n.activeNotificationRid === action.payload.activeNotificationRid,
      );
      state.notifications.splice(index, 1, action.payload);

      state.viewingNotifications = state.viewingNotifications.filter(
        (n) => n.activeNotificationRid !== action.payload.activeNotificationRid,
      );
    },
    payPoliticalCapital: (state, action: PayloadAction<{ cost: number; playerRid: IPlayerRid }>) => {
      if (state.fullGameState === undefined) {
        return state;
      }

      state.fullGameState.activePlayers[action.payload.playerRid].politicalCapital -= action.payload.cost;
    },
    setGameState: (state, action: PayloadAction<IFullGameState>) => {
      state.fullGameState = action.payload;
    },
    setNotifications: (state, action: PayloadAction<IActiveNotification[]>) => {
      state.notifications = action.payload;
    },
    setViewingNotifications: (state, action: PayloadAction<IActiveNotification[]>) => {
      state.viewingNotifications = action.payload;
    },
  },
});

export const {
  handleGameMessage,
  setNotifications,
  setViewingNotifications,
  markNotificationAsRead,
  addVotes,
  addGameEventToStaffer,
  payPoliticalCapital,
  setGameState,
} = gameState.actions;
export const LocalGameStateReducer = gameState.reducer;

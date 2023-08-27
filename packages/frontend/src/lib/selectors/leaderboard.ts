/*
 * Copyright 2023 KM.
 */

import { type IFullGameState } from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { type State } from "../store/createStore";

export const getLeaderboard = createSelector(
  (state: State) => state.localGameState.fullGameState,
  (fullGameState: IFullGameState | undefined) => {
    if (fullGameState === undefined) {
      return [];
    }

    return Object.values(fullGameState.activePlayers)
      .map((activePlayer) => {
        return {
          activePlayer,
          player: fullGameState.players[activePlayer.playerRid],
        };
      })
      .sort((a, b) => {
        if (a.activePlayer.politicalCapital === b.activePlayer.politicalCapital) {
          return a.player.name.localeCompare(b.player.name);
        }

        return a.activePlayer.politicalCapital > b.activePlayer.politicalCapital ? -1 : 1;
      });
  },
);

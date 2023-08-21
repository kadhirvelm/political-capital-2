/*
 * Copyright 2023 KM.
 */

import { type IFullGameState } from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { type State } from "../store/createStore";

export const getActiveResolution = createSelector(
  (state: State) => state.localGameState.fullGameState,
  (fullGameState: IFullGameState | undefined) => {
    if (fullGameState === undefined) {
      return;
    }

    const resolutionsSorted = [...fullGameState.activeResolutions].sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));

    if (resolutionsSorted.length === 0) {
      return;
    }

    return resolutionsSorted[0];
  },
);

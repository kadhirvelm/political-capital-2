/**
 * Copyright (c) 2023 - KM
 */

import { IFullGameState } from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { State } from "../store/createStore";

export const getActiveResolution = createSelector(
    (state: State) => state.localGameState.fullGameState,
    (fullGameState: IFullGameState | undefined) => {
        if (fullGameState === undefined) {
            return undefined;
        }

        const resolutionsSorted = fullGameState.activeResolutions
            .slice()
            .sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));

        if (resolutionsSorted.length === 0) {
            return undefined;
        }

        return resolutionsSorted[0];
    },
);

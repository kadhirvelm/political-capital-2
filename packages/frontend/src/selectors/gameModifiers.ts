/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getCostToAcquireModifier,
    getEffectivenessModifier,
    getPayoutPerResolutionModifier,
    getTimeToAcquireModifier,
    IFullGameState,
    IPossibleStaffer,
    isStafferHiringDisabled,
    isStafferTrainingDisabled,
} from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { State } from "../store/createStore";

export const DEFAULT_STAFFER_MODIFIERS = {
    costToAcquire: 1,
    timeToAcquire: 1,
    effectiveness: 1,
    disableHiring: false,
    disableTraining: false,
};

export type IResolvedGameModifiersForEachStaffer = {
    [key in IPossibleStaffer["type"]]: {
        costToAcquire: number;
        timeToAcquire: number;
        effectiveness: number;
        disableHiring: boolean;
        disableTraining: boolean;
    };
};

export interface IResolvedGameModifiers {
    game: {
        payoutPerResolution: number;
    };
    staffers: IResolvedGameModifiersForEachStaffer;
}

export const getGameModifiers = createSelector(
    (state: State) => state.localGameState.fullGameState,
    (fullGameState: IFullGameState | undefined) => {
        const resolvedGameModifiers: IResolvedGameModifiers = {
            game: { payoutPerResolution: 1 },
            staffers: {} as IResolvedGameModifiersForEachStaffer,
        };

        if (fullGameState === undefined) {
            return resolvedGameModifiers;
        }

        resolvedGameModifiers.game.payoutPerResolution = getPayoutPerResolutionModifier(
            fullGameState.passedGameModifiers,
        );

        Object.values(DEFAULT_STAFFER).forEach((staffer) => {
            resolvedGameModifiers.staffers[staffer.type] = {
                costToAcquire: getCostToAcquireModifier(fullGameState.passedGameModifiers, staffer),
                timeToAcquire: getTimeToAcquireModifier(fullGameState.passedGameModifiers, staffer),
                effectiveness: getEffectivenessModifier(fullGameState.passedGameModifiers, staffer),
                disableHiring: isStafferHiringDisabled(fullGameState.passedGameModifiers, staffer),
                disableTraining: isStafferTrainingDisabled(fullGameState.passedGameModifiers, staffer),
            };
        });

        return resolvedGameModifiers;
    },
);

export const gameModifiersWithResolution = createSelector(
    (state: State) => state.localGameState.fullGameState,
    (fullGameState: IFullGameState | undefined) => {
        if (fullGameState === undefined) {
            return [];
        }

        return fullGameState.passedGameModifiers
            .map((modifier) => {
                const accordingResolution = fullGameState.activeResolutions.find(
                    (resolution) => resolution.activeResolutionRid === modifier.fromActiveResolutionRid,
                );

                return {
                    modifier,
                    accordingResolution,
                };
            })
            .sort((a, b) =>
                (a.accordingResolution?.createdOn ?? 0) > (b.accordingResolution?.createdOn ?? 0) ? -1 : 1,
            );
    },
);

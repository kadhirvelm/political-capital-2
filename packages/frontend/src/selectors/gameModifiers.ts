/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getStafferAcquisitionCost,
    getStafferAcquisitionTime,
    getTotalAllowedRecruits,
    getTotalAllowedTrainees,
    getTotalAllowedVotes,
    getTotalPayout,
    IFullGameState,
    IPassedGameModifier,
    IPlayerRid,
    IPossibleStaffer,
    isGenerator,
    isRecruit,
    isStafferHiringDisabled,
    isStafferTrainingDisabled,
    isTrainer,
    isVoter,
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

const getEffectivenessNumber = (passedGameModifiers: IPassedGameModifier[], staffer: IPossibleStaffer): number => {
    if (isVoter(staffer)) {
        return getTotalAllowedVotes(staffer, passedGameModifiers);
    }

    if (isGenerator(staffer)) {
        return getTotalPayout(staffer, passedGameModifiers);
    }

    if (isRecruit(staffer)) {
        return getTotalAllowedRecruits(staffer, passedGameModifiers);
    }

    if (isTrainer(staffer)) {
        return getTotalAllowedTrainees(staffer, passedGameModifiers);
    }

    return 0;
};

export const getGameModifiers = createSelector(
    (state: State) => state.playerState.player?.playerRid,
    (state: State) => state.localGameState.fullGameState?.activePlayersStaffers,
    (state: State) => state.localGameState.fullGameState?.passedGameModifiers,
    (
        playerRid: IPlayerRid | undefined,
        activePlayerStaffers: IFullGameState["activePlayersStaffers"] | undefined,
        passedGameModifiers: IPassedGameModifier[] | undefined,
    ): IResolvedGameModifiersForEachStaffer => {
        const resolvedGameModifiers: IResolvedGameModifiersForEachStaffer = {} as IResolvedGameModifiersForEachStaffer;

        if (activePlayerStaffers === undefined || passedGameModifiers === undefined) {
            return resolvedGameModifiers;
        }

        const playerParty = playerRid === undefined ? [] : activePlayerStaffers[playerRid] ?? [];

        Object.values(DEFAULT_STAFFER).forEach((staffer) => {
            resolvedGameModifiers[staffer.type] = {
                costToAcquire: getStafferAcquisitionCost(staffer, passedGameModifiers, playerParty),
                timeToAcquire: getStafferAcquisitionTime(staffer, passedGameModifiers, playerParty),
                effectiveness: getEffectivenessNumber(passedGameModifiers, staffer),
                disableHiring: isStafferHiringDisabled(passedGameModifiers, staffer),
                disableTraining: isStafferTrainingDisabled(passedGameModifiers, staffer),
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

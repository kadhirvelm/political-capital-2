/*
 * Copyright 2023 KM.
 */

import {
  DEFAULT_STAFFER,
  getStafferAcquisitionCost,
  getStafferAcquisitionTime,
  getTotalAllowedRecruits,
  getTotalAllowedTrainees,
  getTotalAllowedVotes,
  getTotalPayout,
  type IFullGameState,
  type IPassedGameModifier,
  type IPlayerRid,
  type IPossibleStaffer,
  isGenerator,
  isRecruit,
  isStafferHiringDisabled,
  isStafferTrainingDisabled,
  isTrainer,
  isVoter,
} from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { type State } from "../store/createStore";
import { roundToThousand } from "../utility/roundTo";

export const DEFAULT_STAFFER_MODIFIERS = {
  costToAcquire: 1,
  disableHiring: false,
  disableTraining: false,
  effectiveness: 1,
  timeToAcquire: 1,
};

export type IResolvedGameModifiersForEachStaffer = {
  [key in IPossibleStaffer["type"]]: {
    costToAcquire: number;
    disableHiring: boolean;
    disableTraining: boolean;
    effectiveness: number;
    timeToAcquire: number;
  };
};

const getEffectivenessNumber = (passedGameModifiers: IPassedGameModifier[], staffer: IPossibleStaffer): number => {
  if (isVoter(staffer)) {
    return getTotalAllowedVotes(staffer, passedGameModifiers);
  }

  if (isGenerator(staffer)) {
    return roundToThousand(getTotalPayout(staffer, passedGameModifiers));
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

    for (const staffer of Object.values(DEFAULT_STAFFER)) {
      resolvedGameModifiers[staffer.type] = {
        costToAcquire: getStafferAcquisitionCost(staffer, passedGameModifiers, playerParty),
        disableHiring: isStafferHiringDisabled(passedGameModifiers, staffer),
        disableTraining: isStafferTrainingDisabled(passedGameModifiers, staffer),
        effectiveness: getEffectivenessNumber(passedGameModifiers, staffer),
        timeToAcquire: getStafferAcquisitionTime(staffer, passedGameModifiers, playerParty),
      };
    }

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
          accordingResolution,
          modifier,
        };
      })
      .sort((a, b) => ((a.accordingResolution?.createdOn ?? 0) > (b.accordingResolution?.createdOn ?? 0) ? -1 : 1));
  },
);

/**
 * Copyright (c) 2023 - KM
 */

import { DEFAULT_STAFFER, IAllStaffers, isGenerator, isRecruit, isTrainer, isVoter } from "@pc2/api";
import { IResolvedGameModifiers } from "../selectors/gameModifiers";
import { roundToHundred, roundToThousand } from "./roundTo";

export const getAcquisitionTimeNumber = (
    gameModifiers: IResolvedGameModifiers,
    stafferType: Exclude<keyof IAllStaffers, "unknown">,
): number => {
    const defaultStaffer = DEFAULT_STAFFER[stafferType];

    return Math.round(defaultStaffer.timeToAcquire * gameModifiers.staffers[stafferType].timeToAcquire);
};

export const getAcquisitionCostNumber = (
    gameModifiers: IResolvedGameModifiers,
    stafferType: Exclude<keyof IAllStaffers, "unknown">,
): number => {
    const defaultStaffer = DEFAULT_STAFFER[stafferType];

    return roundToHundred(defaultStaffer.costToAcquire * gameModifiers.staffers[stafferType].costToAcquire);
};

export const getEffectivenessNumber = (
    gameModifiers: IResolvedGameModifiers,
    stafferType: Exclude<keyof IAllStaffers, "unknown">,
): number => {
    const defaultStaffer = DEFAULT_STAFFER[stafferType];

    if (isVoter(defaultStaffer)) {
        return Math.floor(defaultStaffer.votes * gameModifiers.staffers[stafferType].effectiveness);
    }

    if (isGenerator(defaultStaffer)) {
        return roundToThousand(defaultStaffer.payout * gameModifiers.staffers[stafferType].effectiveness);
    }

    if (isRecruit(defaultStaffer)) {
        return Math.floor(defaultStaffer.recruitCapacity * gameModifiers.staffers[stafferType].effectiveness);
    }

    if (isTrainer(defaultStaffer)) {
        return Math.floor(defaultStaffer.trainingCapacity * gameModifiers.staffers[stafferType].effectiveness);
    }

    return 0;
};

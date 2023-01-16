/**
 * Copyright (c) 2023 - KM
 */

import { TIME_BETWEEN_RESOLUTIONS_IN_DAYS, TIME_FOR_EACH_RESOLUTION_IN_DAYS } from "../constants/game";
import { DEFAULT_STAFFER } from "../types/generatedStaffers";
import { IActiveStaffer, IPassedGameModifier } from "../types/politicalCapitalTwo";
import {
    getStafferAcquisitionCost,
    getStafferAcquisitionTime,
    getStafferDetails,
    IActiveOrPossibleStaffer,
} from "../utils/staffer";

export function getTotalCostForStaffer(
    staffer: IActiveOrPossibleStaffer,
    passedGameModifiers: IPassedGameModifier[],
    activePlayerStaffers: IActiveStaffer[],
): number {
    const stafferDetails = getStafferDetails(staffer);
    const costToAcquire = getStafferAcquisitionCost(staffer, passedGameModifiers, activePlayerStaffers);

    if (stafferDetails.upgradedFrom.length === 0) {
        return costToAcquire;
    }

    const findUpgradedFrom = Object.values(DEFAULT_STAFFER).find((s) => s.type === stafferDetails.upgradedFrom[0]);
    if (findUpgradedFrom === undefined) {
        return NaN;
    }

    return costToAcquire + getTotalCostForStaffer(findUpgradedFrom, passedGameModifiers, activePlayerStaffers);
}

export function getTotalTimeCost(
    staffer: IActiveOrPossibleStaffer,
    passedGameModifiers: IPassedGameModifier[],
    activePlayerStaffers: IActiveStaffer[],
): number {
    const stafferDetails = getStafferDetails(staffer);
    const timeToAcquire = getStafferAcquisitionTime(staffer, passedGameModifiers, activePlayerStaffers);

    if (stafferDetails.upgradedFrom.length === 0) {
        return timeToAcquire;
    }

    const findUpgradedFrom = Object.values(DEFAULT_STAFFER).find((s) => s.type === stafferDetails.upgradedFrom[0]);
    if (findUpgradedFrom === undefined) {
        return NaN;
    }

    return timeToAcquire + getTotalTimeCost(findUpgradedFrom, passedGameModifiers, activePlayerStaffers);
}

export function timeInResolutions(totalTime: number) {
    return Math.floor(totalTime / (TIME_BETWEEN_RESOLUTIONS_IN_DAYS + TIME_FOR_EACH_RESOLUTION_IN_DAYS));
}

/**
 * Copyright (c) 2023 - KM
 */

import { TOTAL_DAYS_IN_GAME } from "../constants/game";
import { IGameClock } from "../types/BrandedIDs";
import { IActiveStaffer, IPassedGameModifier } from "../types/politicalCapitalTwo";
import {
    getStafferAcquisitionCost,
    getStafferAcquisitionTime,
    getStafferDetails,
    getTotalPayout,
    IActiveOrPossibleStaffer,
    isGenerator,
} from "../utils/staffer";

export function getPotentialPayoutForStaffer(
    staffer: IActiveOrPossibleStaffer,
    passedGameModifiers: IPassedGameModifier[],
    currentGameClock: IGameClock,
    activePlayerStaffers: IActiveStaffer[],
) {
    const stafferDetails = getStafferDetails(staffer);
    if (!isGenerator(stafferDetails)) {
        return 0;
    }

    const costToAcquire = getStafferAcquisitionCost(staffer, passedGameModifiers, activePlayerStaffers);
    const timeToAcquire = getStafferAcquisitionTime(staffer, passedGameModifiers, activePlayerStaffers);
    const totalPayoutPerDay = getTotalPayout(
        { ...stafferDetails, state: "active" } as IActiveOrPossibleStaffer,
        passedGameModifiers,
    );

    const totalPayoutDays = TOTAL_DAYS_IN_GAME - currentGameClock - timeToAcquire;

    return totalPayoutPerDay * totalPayoutDays - costToAcquire;
}

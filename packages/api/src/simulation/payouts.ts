/**
 * Copyright (c) 2023 - KM
 */

import { TOTAL_DAYS_IN_GAME } from "../constants/game";
import { IGameClock } from "../types/BrandedIDs";
import { IPassedGameModifier } from "../types/politicalCapitalTwo";
import { getEffectivenessModifier } from "../utils/gameModifierUtils";
import {
    getStafferAcquisitionCost,
    getStafferAcquisitionTime,
    getStafferDetails,
    IActiveOrPossibleStaffer,
    isGenerator,
} from "../utils/staffer";

export function getPotentialPayoutForStaffer(
    staffer: IActiveOrPossibleStaffer,
    passedGameModifiers: IPassedGameModifier[],
    currentGameClock: IGameClock,
) {
    const stafferDetails = getStafferDetails(staffer);
    if (!isGenerator(stafferDetails)) {
        return 0;
    }

    const costToAcquire = getStafferAcquisitionCost(staffer, passedGameModifiers);
    const timeToAcquire = getStafferAcquisitionTime(staffer, passedGameModifiers);
    const effectivenessModifier = getEffectivenessModifier(passedGameModifiers, staffer);

    const totalPayoutDays = TOTAL_DAYS_IN_GAME - currentGameClock - timeToAcquire;

    return stafferDetails.payout * effectivenessModifier * totalPayoutDays - costToAcquire;
}

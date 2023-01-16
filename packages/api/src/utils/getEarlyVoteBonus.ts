/**
 * Copyright (c) 2023 - KM
 */

import { MAX_EARLY_VOTING_BONUS, MINIMUM_EARLY_VOTING_DAYS, TIME_FOR_EACH_RESOLUTION_IN_DAYS } from "../constants/game";
import { IGameClock } from "../types/BrandedIDs";

// NOTE: subtracting 1 because you can't get paid out on day 1
const TOTAL_EARLY_VOTING_TIME = TIME_FOR_EACH_RESOLUTION_IN_DAYS - MINIMUM_EARLY_VOTING_DAYS - 1;

export function getEarlyVoteBonus(currentGameClock: IGameClock, tallyResolution: IGameClock) {
    const timeToTally = tallyResolution - currentGameClock - MINIMUM_EARLY_VOTING_DAYS;
    if (timeToTally <= 0) {
        return 0;
    }

    return (timeToTally / TOTAL_EARLY_VOTING_TIME) * MAX_EARLY_VOTING_BONUS;
}

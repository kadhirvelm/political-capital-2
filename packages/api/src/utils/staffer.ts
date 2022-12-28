/**
 * Copyright (c) 2022 - KM
 */

import { IPartTimeInstructor, IPhoneBanker, IRecruiter, IRepresentative } from "../types/IStaffer";
import { IActiveStaffer } from "../types/politicalCapitalTwo";

export function getTotalAllowedRecruits(staffer: IActiveStaffer): number {
    if (staffer.state === "disabled") {
        return 0;
    }

    return (staffer.stafferDetails as IRecruiter).recruitCapacity ?? 0;
}

export function getTotalAllowedTrainees(staffer: IActiveStaffer): number {
    if (staffer.state === "disabled") {
        return 0;
    }

    return (staffer.stafferDetails as IPartTimeInstructor).trainingCapacity ?? 0;
}

export function getTotalAllowedVotes(staffer: IActiveStaffer): number {
    if (staffer.state === "disabled") {
        return 0;
    }

    return (staffer.stafferDetails as IRepresentative).votes ?? 0;
}

export function getPayoutForStaffer(staffer: IActiveStaffer): number {
    if (staffer.state === "disabled") {
        return 0;
    }

    return (staffer.stafferDetails as IPhoneBanker).payout ?? 0;
}

/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getPayoutForStaffer,
    getStafferDetails,
    getTotalAllowedRecruits,
    getTotalAllowedTrainees,
    getTotalAllowedVotes,
    IActiveOrPossibleStaffer,
    IActiveStaffer,
    StafferLadderIndex,
} from "@pc2/api";

export type IStafferCategory = "voting" | "generator" | "support" | "passive" | "none";

export function getStafferCategory(staffer: IActiveOrPossibleStaffer): IStafferCategory {
    if (getTotalAllowedVotes(staffer) > 0) {
        return "voting";
    }

    if (getPayoutForStaffer(staffer) > 0) {
        return "generator";
    }

    if (getTotalAllowedRecruits(staffer) > 0 || getTotalAllowedTrainees(staffer) > 0) {
        return "support";
    }

    return "none";
}

export function getStaffersOfCategory(activeStaffers: IActiveStaffer[], category: IStafferCategory) {
    return activeStaffers
        .slice()
        .filter((activeStaffer) => {
            return getStafferCategory(activeStaffer.stafferDetails) === category;
        })
        .sort((a, b) => a.stafferDetails.type.localeCompare(b.stafferDetails.type));
}

export function getTrainsIntoDisplayName(staffer: IActiveOrPossibleStaffer): string[] {
    const stafferDetails = getStafferDetails(staffer);

    return StafferLadderIndex[stafferDetails.type].map(
        (type: keyof typeof DEFAULT_STAFFER) => DEFAULT_STAFFER[type].displayName,
    );
}

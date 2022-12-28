/**
 * Copyright (c) 2022 - KM
 */

import { getPayoutForStaffer, getTotalAllowedVotes, IActiveStaffer, IPossibleStaffer } from "@pc2/api";

export type IStafferCategory = "voting" | "generator" | "support";

export function getStafferCategory(staffer: IPossibleStaffer): IStafferCategory {
    if (getTotalAllowedVotes({ state: "active", stafferDetails: staffer } as IActiveStaffer) > 0) {
        return "voting";
    }

    if (getPayoutForStaffer({ state: "active", stafferDetails: staffer } as IActiveStaffer) > 0) {
        return "generator";
    }

    return "support";
}

export function getStaffersOfCategory(activeStaffers: IActiveStaffer[], category: IStafferCategory) {
    return activeStaffers
        .slice()
        .filter((activeStaffer) => {
            return getStafferCategory(activeStaffer.stafferDetails) === category;
        })
        .sort((a, b) => a.stafferDetails.type.localeCompare(b.stafferDetails.type));
}

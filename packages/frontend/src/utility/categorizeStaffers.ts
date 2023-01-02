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
    isGenerator,
    isRecruit,
    isTrainer,
    isVoter,
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
        .sort((a, b) => {
            const defaultCompare = a.stafferDetails.type.localeCompare(b.stafferDetails.type);

            if (isVoter(a)) {
                const aVotes = getTotalAllowedVotes(a);
                const bVotes = getTotalAllowedVotes(b);

                return aVotes === bVotes ? defaultCompare : aVotes > bVotes ? -1 : 1;
            }

            if (isGenerator(a)) {
                const aGeneration = getPayoutForStaffer(a);
                const bGeneration = getPayoutForStaffer(b);

                return aGeneration === bGeneration ? defaultCompare : aGeneration > bGeneration ? -1 : 1;
            }

            const isATrainer = isTrainer(a);
            const isBTrainer = isTrainer(b);

            const isARecruit = isRecruit(a);
            const isBRecruit = isRecruit(b);

            if (isATrainer && isBTrainer) {
                const aCapacity = getTotalAllowedTrainees(a);
                const bCapacity = getTotalAllowedTrainees(b);

                return aCapacity === bCapacity ? defaultCompare : aCapacity > bCapacity ? -1 : 1;
            }

            if (isARecruit && isBRecruit) {
                const aCapacity = getTotalAllowedRecruits(a);
                const bCapacity = getTotalAllowedRecruits(b);

                return aCapacity === bCapacity ? defaultCompare : aCapacity > bCapacity ? -1 : 1;
            }

            return isATrainer ? -1 : 1;
        });
}

export function getTrainsIntoDisplayName(staffer: IActiveOrPossibleStaffer): string[] {
    const stafferDetails = getStafferDetails(staffer);

    return StafferLadderIndex[stafferDetails.type].map(
        (type: keyof typeof DEFAULT_STAFFER) => DEFAULT_STAFFER[type].displayName,
    );
}

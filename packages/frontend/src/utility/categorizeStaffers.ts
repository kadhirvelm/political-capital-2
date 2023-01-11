/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getPayoutForStaffer,
    getStafferCategory,
    getStafferDetails,
    getTotalAllowedRecruits,
    getTotalAllowedTrainees,
    getTotalAllowedVotes,
    IActiveOrPossibleStaffer,
    IActiveStaffer,
    isGenerator,
    isRecruit,
    IStafferCategory,
    isTrainer,
    isVoter,
    StafferLadderIndex,
} from "@pc2/api";

export function getStaffersOfCategory(activeStaffers: IActiveStaffer[], category: IStafferCategory | undefined) {
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

            if (isTrainer(a)) {
                const aCapacity = getTotalAllowedTrainees(a);
                const bCapacity = getTotalAllowedTrainees(b);

                return aCapacity === bCapacity ? defaultCompare : aCapacity > bCapacity ? -1 : 1;
            }

            if (isRecruit(a)) {
                const aCapacity = getTotalAllowedRecruits(a);
                const bCapacity = getTotalAllowedRecruits(b);

                return aCapacity === bCapacity ? defaultCompare : aCapacity > bCapacity ? -1 : 1;
            }

            return defaultCompare;
        });
}

export function getTrainsIntoDisplayName(staffer: IActiveOrPossibleStaffer): string[] {
    const stafferDetails = getStafferDetails(staffer);

    return StafferLadderIndex[stafferDetails.type].map(
        (type: keyof typeof DEFAULT_STAFFER) => DEFAULT_STAFFER[type].displayName,
    );
}

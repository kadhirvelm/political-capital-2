/**
 * Copyright (c) 2022 - KM
 */

import { DEFAULT_STAFFER, IPossibleStaffer } from "../types/generatedStaffers";
import {
    IAdjunctInstructor,
    IGenerator,
    IInitiate,
    IPhoneBanker,
    IRecruit,
    IRecruiter,
    IRepresentative,
    ITrainer,
    IVoter,
} from "../types/IStaffer";
import { IActiveStaffer } from "../types/politicalCapitalTwo";

export type IActiveOrPossibleStaffer = IActiveStaffer | IPossibleStaffer;

export function isActiveStaffer(staffer: IActiveOrPossibleStaffer): staffer is IActiveStaffer {
    return (staffer as IActiveStaffer).stafferDetails !== undefined;
}

export function getStafferDetails(staffer: IActiveOrPossibleStaffer): IPossibleStaffer {
    if (isActiveStaffer(staffer)) {
        return staffer.stafferDetails;
    }

    return staffer;
}

export function getTotalAllowedRecruits(staffer: IActiveOrPossibleStaffer): number {
    const stafferDetails = getStafferDetails(staffer);
    if (isActiveStaffer(staffer) && staffer.state === "disabled") {
        return 0;
    }

    return (stafferDetails as IRecruit).recruitCapacity ?? 0;
}

export function isRecruit(staffer: IActiveOrPossibleStaffer): staffer is IRecruiter {
    return (getStafferDetails(staffer) as IRecruit).recruitCapacity !== undefined;
}

export function getTotalAllowedTrainees(staffer: IActiveOrPossibleStaffer): number {
    const stafferDetails = getStafferDetails(staffer);
    if (isActiveStaffer(staffer) && staffer.state === "disabled") {
        return 0;
    }

    return (stafferDetails as ITrainer).trainingCapacity ?? 0;
}

export function isTrainer(staffer: IActiveOrPossibleStaffer): staffer is IAdjunctInstructor {
    return (getStafferDetails(staffer) as ITrainer).trainingCapacity !== undefined;
}

export function getTotalAllowedVotes(staffer: IActiveOrPossibleStaffer): number {
    const stafferDetails = getStafferDetails(staffer);
    if (isActiveStaffer(staffer) && staffer.state === "disabled") {
        return 0;
    }

    return (stafferDetails as IVoter).votes ?? 0;
}

export function isVoter(staffer: IActiveOrPossibleStaffer): staffer is IRepresentative {
    return (getStafferDetails(staffer) as IVoter).votes !== undefined;
}

export function getPayoutForStaffer(staffer: IActiveOrPossibleStaffer): number {
    const stafferDetails = getStafferDetails(staffer);
    if (isActiveStaffer(staffer) && staffer.state === "disabled") {
        return 0;
    }

    return (stafferDetails as IGenerator).payout ?? 0;
}

export function getPotentialPayoutForStaffer(staffer: IActiveOrPossibleStaffer, days_left: number): number {
    if (!isGenerator(staffer)){
        return 0;
    }
    return (getStafferDetails(staffer) as IGenerator).payout * days_left;
}

export function isGenerator(staffer: IActiveOrPossibleStaffer): staffer is IPhoneBanker {
    return (getStafferDetails(staffer) as IGenerator).payout !== undefined;
}

export function isShadowGovernment(staffer: IActiveOrPossibleStaffer): staffer is IInitiate {
    return (getStafferDetails(staffer) as IInitiate).shadowGovernment === true;
}

export const allRecruits = (() => {
    const allStaffers = Object.values(DEFAULT_STAFFER);
    return allStaffers
        .filter(isRecruit)
        .slice()
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

export const allTrainers = (() => {
    const allStaffers = Object.values(DEFAULT_STAFFER);
    return allStaffers
        .filter(isTrainer)
        .slice()
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

export const allGenerators = (() => {
    const allStaffers = Object.values(DEFAULT_STAFFER);
    return allStaffers
        .filter(isGenerator)
        .slice()
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

export const allVoters = (() => {
    const allStaffers = Object.values(DEFAULT_STAFFER);
    return allStaffers
        .filter(isVoter)
        .slice()
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

export const allShadowGovernment = (() => {
    const allStaffers = Object.values(DEFAULT_STAFFER);
    return allStaffers
        .filter(isShadowGovernment)
        .slice()
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

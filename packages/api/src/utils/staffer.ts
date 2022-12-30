/**
 * Copyright (c) 2022 - KM
 */

import { IPossibleStaffer } from "../types/generatedStaffers";
import {
    IGenerator,
    IPartTimeInstructor,
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

export function isTrainer(staffer: IActiveOrPossibleStaffer): staffer is IPartTimeInstructor {
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

export function isGenerator(staffer: IActiveOrPossibleStaffer): staffer is IPhoneBanker {
    return (getStafferDetails(staffer) as IGenerator).payout !== undefined;
}

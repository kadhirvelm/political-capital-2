/**
 * Copyright (c) 2022 - KM
 */

// NOTE: this is a generated file, please run yarn convert in the api package to regenerate it.

import {
    IIntern,
    INewHire,
    IRepresentative,
    ISeniorRepresentative,
    IIndependentRepresentative,
    ISenator,
    ISeasonedSenator,
    IIndependentSenator,
    IPhoneBanker,
    ISocialMediaManager,
    IRecruiter,
    IHrManager,
    IPartTimeInstructor,
    ICoach,
} from "./IStaffer";
import { IVisit } from "./IVisit";

export interface IAllStaffers {
    intern: IIntern;
    newHire: INewHire;
    representative: IRepresentative;
    seniorRepresentative: ISeniorRepresentative;
    independentRepresentative: IIndependentRepresentative;
    senator: ISenator;
    seasonedSenator: ISeasonedSenator;
    independentSenator: IIndependentSenator;
    phoneBanker: IPhoneBanker;
    socialMediaManager: ISocialMediaManager;
    recruiter: IRecruiter;
    hrManager: IHrManager;
    partTimeInstructor: IPartTimeInstructor;
    coach: ICoach;
    unknown: never;
}

export type IPossibleStaffer = IAllStaffers[keyof IAllStaffers];

export const DEFAULT_STAFFER: Omit<IAllStaffers, "unknown"> = {
    intern: {
        displayName: "Intern",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        type: "intern",
    },
    newHire: {
        displayName: "New hire",
        upgradedFrom: ["intern"],
        costToAcquire: 1,
        timeToAcquire: 6,
        payout: 0.25,
        type: "newHire",
    },
    representative: {
        displayName: "Representative",
        upgradedFrom: [],
        costToAcquire: 2,
        timeToAcquire: 12,
        votes: 1,
        type: "representative",
    },
    seniorRepresentative: {
        displayName: "Senior representative",
        upgradedFrom: ["representative"],
        costToAcquire: 4,
        timeToAcquire: 12,
        votes: 2,
        type: "seniorRepresentative",
    },
    independentRepresentative: {
        displayName: "Independent representative",
        upgradedFrom: ["representative"],
        costToAcquire: 4,
        timeToAcquire: 12,
        votes: 1,
        isIndependent: true,
        type: "independentRepresentative",
    },
    senator: {
        displayName: "Senator",
        upgradedFrom: ["seniorRepresentative"],
        costToAcquire: 6,
        timeToAcquire: 20,
        votes: 3,
        type: "senator",
    },
    seasonedSenator: {
        displayName: "Seasoned senator",
        upgradedFrom: ["senator"],
        costToAcquire: 8,
        timeToAcquire: 20,
        votes: 4,
        type: "seasonedSenator",
    },
    independentSenator: {
        displayName: "Independent senator",
        upgradedFrom: ["senator"],
        costToAcquire: 6,
        timeToAcquire: 20,
        votes: 3,
        isIndependent: true,
        type: "independentSenator",
    },
    phoneBanker: {
        displayName: "Phone banker",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        payout: 0.5,
        type: "phoneBanker",
    },
    socialMediaManager: {
        displayName: "Social media manager",
        upgradedFrom: ["phoneBanker", "newHire"],
        costToAcquire: 4,
        timeToAcquire: 12,
        payout: 1,
        type: "socialMediaManager",
    },
    recruiter: {
        displayName: "Recruiter",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        recruitCapacity: 1,
        type: "recruiter",
    },
    hrManager: {
        displayName: "Hr manager",
        upgradedFrom: ["recruiter", "newHire"],
        costToAcquire: 2,
        timeToAcquire: 12,
        recruitCapacity: 2,
        type: "hrManager",
    },
    partTimeInstructor: {
        displayName: "Part time instructor",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        trainingCapacity: 1,
        type: "partTimeInstructor",
    },
    coach: {
        displayName: "Coach",
        upgradedFrom: ["partTimeInstructor", "newHire"],
        costToAcquire: 2,
        timeToAcquire: 12,
        trainingCapacity: 2,
        type: "coach",
    },
};

export namespace IStaffer {
    export const isIntern = (staffer: IPossibleStaffer): staffer is IIntern => {
        return staffer.type === "intern";
    };

    export const isNewHire = (staffer: IPossibleStaffer): staffer is INewHire => {
        return staffer.type === "newHire";
    };

    export const isRepresentative = (staffer: IPossibleStaffer): staffer is IRepresentative => {
        return staffer.type === "representative";
    };

    export const isSeniorRepresentative = (staffer: IPossibleStaffer): staffer is ISeniorRepresentative => {
        return staffer.type === "seniorRepresentative";
    };

    export const isIndependentRepresentative = (staffer: IPossibleStaffer): staffer is IIndependentRepresentative => {
        return staffer.type === "independentRepresentative";
    };

    export const isSenator = (staffer: IPossibleStaffer): staffer is ISenator => {
        return staffer.type === "senator";
    };

    export const isSeasonedSenator = (staffer: IPossibleStaffer): staffer is ISeasonedSenator => {
        return staffer.type === "seasonedSenator";
    };

    export const isIndependentSenator = (staffer: IPossibleStaffer): staffer is IIndependentSenator => {
        return staffer.type === "independentSenator";
    };

    export const isPhoneBanker = (staffer: IPossibleStaffer): staffer is IPhoneBanker => {
        return staffer.type === "phoneBanker";
    };

    export const isSocialMediaManager = (staffer: IPossibleStaffer): staffer is ISocialMediaManager => {
        return staffer.type === "socialMediaManager";
    };

    export const isRecruiter = (staffer: IPossibleStaffer): staffer is IRecruiter => {
        return staffer.type === "recruiter";
    };

    export const isHrManager = (staffer: IPossibleStaffer): staffer is IHrManager => {
        return staffer.type === "hrManager";
    };

    export const isPartTimeInstructor = (staffer: IPossibleStaffer): staffer is IPartTimeInstructor => {
        return staffer.type === "partTimeInstructor";
    };

    export const isCoach = (staffer: IPossibleStaffer): staffer is ICoach => {
        return staffer.type === "coach";
    };

    export const visit = <ReturnValue>(value: IPossibleStaffer, visitor: IVisit<IAllStaffers, ReturnValue>) => {
        if (isIntern(value)) {
            return visitor.intern(value);
        }

        if (isNewHire(value)) {
            return visitor.newHire(value);
        }

        if (isRepresentative(value)) {
            return visitor.representative(value);
        }

        if (isSeniorRepresentative(value)) {
            return visitor.seniorRepresentative(value);
        }

        if (isIndependentRepresentative(value)) {
            return visitor.independentRepresentative(value);
        }

        if (isSenator(value)) {
            return visitor.senator(value);
        }

        if (isSeasonedSenator(value)) {
            return visitor.seasonedSenator(value);
        }

        if (isIndependentSenator(value)) {
            return visitor.independentSenator(value);
        }

        if (isPhoneBanker(value)) {
            return visitor.phoneBanker(value);
        }

        if (isSocialMediaManager(value)) {
            return visitor.socialMediaManager(value);
        }

        if (isRecruiter(value)) {
            return visitor.recruiter(value);
        }

        if (isHrManager(value)) {
            return visitor.hrManager(value);
        }

        if (isPartTimeInstructor(value)) {
            return visitor.partTimeInstructor(value);
        }

        if (isCoach(value)) {
            return visitor.coach(value);
        }

        return visitor.unknown(value);
    };
}

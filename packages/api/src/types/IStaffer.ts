/**
 * Copyright (c) 2022 - KM
 */

import { IVisit } from "./IVisit";

export interface IBasicStaffer {
    displayName: string;
    upgradedFrom: Array<keyof IAllStaffers>;
    costToAcquire: number;
    timeToAcquire: number;
    type: keyof IAllStaffers;
}

export interface IInternStaffer extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    type: "intern";
}

export interface IRepresentative extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 2;
    timeToAcquire: 12;
    votes: 1;
    type: "representative";
}

export interface ISeniorRepresentative extends IBasicStaffer {
    upgradedFrom: ["representative"];
    costToAcquire: 4;
    timeToAcquire: 12;
    votes: 2;
    type: "seniorRepresentative";
}

export interface IIndependentRepresentative extends IBasicStaffer {
    upgradedFrom: ["representative"];
    costToAcquire: 4;
    timeToAcquire: 12;
    votes: 1;
    type: "independentRepresentative";
}

export interface IPhoneBanker extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    payout: 0.5;
    type: "phoneBanker";
}

export interface ISocialMediaManager extends IBasicStaffer {
    upgradedFrom: ["phoneBanker"];
    costToAcquire: 4;
    timeToAcquire: 12;
    payout: 1;
    type: "socialMediaManager";
}

export interface IRecruiter extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    recruitCapacity: 1;
    type: "recruiter";
}

export interface IPartTimeInstructor extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    trainingCapacity: 1;
    type: "partTimeInstructor";
}

export interface IAllStaffers {
    intern: IInternStaffer;
    representative: IRepresentative;
    seniorRepresentative: ISeniorRepresentative;
    independentRepresentative: IIndependentRepresentative;
    phoneBanker: IPhoneBanker;
    socialMediaManager: ISocialMediaManager;
    recruiter: IRecruiter;
    partTimeInstructor: IPartTimeInstructor;
    unknown: never;
}

export const DEFAULT_STAFFER: Omit<IAllStaffers, "unknown"> = {
    intern: {
        displayName: "Intern",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        type: "intern",
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
        type: "independentRepresentative",
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
        upgradedFrom: ["phoneBanker"],
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
    partTimeInstructor: {
        displayName: "Part-time instructor",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        trainingCapacity: 1,
        type: "partTimeInstructor",
    },
};

export type IPossibleStaffer = IAllStaffers[keyof IAllStaffers];

export namespace IStaffer {
    export const isInternStaffer = (staffer: IPossibleStaffer): staffer is IInternStaffer => {
        return staffer.type === "intern";
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

    export const isPhoneBanker = (staffer: IPossibleStaffer): staffer is IPhoneBanker => {
        return staffer.type === "phoneBanker";
    };

    export const isSocialMediaManager = (staffer: IPossibleStaffer): staffer is ISocialMediaManager => {
        return staffer.type === "socialMediaManager";
    };

    export const isRecruiter = (staffer: IPossibleStaffer): staffer is IRecruiter => {
        return staffer.type === "recruiter";
    };

    export const isPartTimeInstructor = (staffer: IPossibleStaffer): staffer is IPartTimeInstructor => {
        return staffer.type === "partTimeInstructor";
    };

    export const visit = <ReturnValue>(value: IPossibleStaffer, visitor: IVisit<IAllStaffers, ReturnValue>) => {
        if (isInternStaffer(value)) {
            return visitor.intern(value);
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

        if (isPhoneBanker(value)) {
            return visitor.phoneBanker(value);
        }

        if (isSocialMediaManager(value)) {
            return visitor.socialMediaManager(value);
        }

        if (isRecruiter(value)) {
            return visitor.recruiter(value);
        }

        if (isPartTimeInstructor(value)) {
            return visitor.partTimeInstructor(value);
        }

        return visitor.unknown(value);
    };
}

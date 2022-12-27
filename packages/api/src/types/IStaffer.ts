/**
 * Copyright (c) 2022 - KM
 */

import { IVisit } from "./IVisit";

export interface IBasicStaffer {
    displayName: string;
    upgradedFrom: IPossibleStaffer["type"][];
    costToAcquire: number;
    timeToAcquire: number;
    type: string;
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
    type: "senior-representative";
}

export interface IPhoneBanker extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    payout: 1;
    type: "phone-banker";
}

export interface IRecruiter extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    type: "recruiter";
}

export interface IPartTimeInstructor extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    type: "part-time-instructor";
}

export interface IAllStaffers {
    intern: IInternStaffer;
    representative: IRepresentative;
    seniorRepresentative: ISeniorRepresentative;
    phoneBanker: IPhoneBanker;
    recruiter: IRecruiter;
    partTimeInstructor: IPartTimeInstructor;
    unknown: never;
}

export const DEFAULT_STAFFER: IAllStaffers = {
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
        type: "senior-representative",
    },
    phoneBanker: {
        displayName: "Phone banker",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        payout: 1,
        type: "phone-banker",
    },
    recruiter: {
        displayName: "Recruiter",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        type: "recruiter",
    },
    partTimeInstructor: {
        displayName: "Part-time instructor",
        upgradedFrom: [],
        costToAcquire: 1,
        timeToAcquire: 6,
        type: "part-time-instructor",
    },
    unknown: {} as never,
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
        return staffer.type === "senior-representative";
    };

    export const isPhoneBanker = (staffer: IPossibleStaffer): staffer is IPhoneBanker => {
        return staffer.type === "phone-banker";
    };

    export const isRecruiter = (staffer: IPossibleStaffer): staffer is IRecruiter => {
        return staffer.type === "recruiter";
    };

    export const isPartTimeInstructor = (staffer: IPossibleStaffer): staffer is IPartTimeInstructor => {
        return staffer.type === "part-time-instructor";
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

        if (isPhoneBanker(value)) {
            return visitor.phoneBanker(value);
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

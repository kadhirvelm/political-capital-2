/**
 * Copyright (c) 2022 - KM
 */

import { IVisit } from "./IVisit";

export interface IBasicStaffer {
    displayName: string;
    upgradedFrom: IPossibleStaffer["type"][];
    type: string;
}

export interface IInternStaffer extends IBasicStaffer {
    type: "intern";
}

export interface INewCongressPerson extends IBasicStaffer {
    type: "new-congress-person";
}

export interface IPhoneBanker extends IBasicStaffer {
    type: "phone-banker";
}

export interface IRecruiter extends IBasicStaffer {
    type: "recruiter";
}

export interface IPartTimeInstructor extends IBasicStaffer {
    type: "part-time-instructor";
}

interface IAllStaffers {
    intern: IInternStaffer;
    newCongressPerson: INewCongressPerson;
    phoneBanker: IPhoneBanker;
    recruiter: IRecruiter;
    partTimeInstructor: IPartTimeInstructor;
    unknown: never;
}

export type IPossibleStaffer = IAllStaffers[keyof IAllStaffers];

export namespace IStaffer {
    export const isInternStaffer = (staffer: IPossibleStaffer): staffer is IInternStaffer => {
        return staffer.type === "intern";
    };

    export const isNewCongressPerson = (staffer: IPossibleStaffer): staffer is INewCongressPerson => {
        return staffer.type === "new-congress-person";
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

        if (isNewCongressPerson(value)) {
            return visitor.newCongressPerson(value);
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

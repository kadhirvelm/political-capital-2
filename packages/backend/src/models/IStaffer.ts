/**
 * Copyright (c) 2022 - KM
 */

import { IVisit } from "./IVisit";

interface IBasicStaffer {
    stafferRid: string;
    type: string;
}

interface IInternStaffer extends IBasicStaffer {
    type: "intern";
}

interface INewCongressPerson extends IBasicStaffer {
    type: "new-congress-person";
}

export interface IAllStaffers {
    intern: IInternStaffer;
    newCongressPerson: INewCongressPerson;
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

    export const visit = <ReturnValue>(value: IPossibleStaffer, visitor: IVisit<IAllStaffers, ReturnValue>) => {
        if (isInternStaffer(value)) {
            return visitor.intern(value);
        }

        if (isNewCongressPerson(value)) {
            return visitor.newCongressPerson(value);
        }

        return visitor.unknown(value);
    };
}

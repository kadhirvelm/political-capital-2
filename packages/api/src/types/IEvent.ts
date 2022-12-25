/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolutionRid, IActiveStafferRid, IPlayerRid } from "./BrandedIDs";
import { IPossibleStaffer } from "./IStaffer";
import { IVisit } from "./IVisit";

interface IBasicEvent {
    type: string;
}

export interface IStartHiringStaffer extends IBasicEvent {
    playerRid: IPlayerRid;
    stafferType: IPossibleStaffer["type"];
    type: "start-hiring-staffer";
}

export interface IFinishHiringStaffer extends IBasicEvent {
    playerRid: IPlayerRid;
    activeStafferRid: IActiveStafferRid;
    type: "finish-hiring-staffer";
}

export interface INewResolution extends IBasicEvent {
    type: "new-resolution";
}

export interface ITallyResolution extends IBasicEvent {
    activeResolutionRid: IActiveResolutionRid;
    type: "tally-resolution";
}

interface IAllEvents {
    startHiringStaffer: IStartHiringStaffer;
    finishHiringStaffer: IFinishHiringStaffer;
    newResolution: INewResolution;
    tallyResolution: ITallyResolution;
    unknown: never;
}

export type IPossibleEvent = IAllEvents[keyof IAllEvents];

export namespace IEvent {
    export const isHireStaffer = (event: IPossibleEvent): event is IStartHiringStaffer => {
        return event.type === "start-hiring-staffer";
    };

    export const isFinishHiringStaffer = (event: IPossibleEvent): event is IFinishHiringStaffer => {
        return event.type === "finish-hiring-staffer";
    };

    export const isNewResolution = (event: IPossibleEvent): event is INewResolution => {
        return event.type === "new-resolution";
    };

    export const isTallyResolution = (event: IPossibleEvent): event is IPossibleEvent => {
        return event.type === "tally-resolution";
    };

    export const visit = <ReturnValue>(value: IPossibleEvent, visitor: IVisit<IAllEvents, ReturnValue>) => {
        if (isHireStaffer(value)) {
            return visitor.startHiringStaffer(value);
        }

        if (isFinishHiringStaffer(value)) {
            return visitor.finishHiringStaffer(value);
        }

        if (isNewResolution(value)) {
            return visitor.newResolution(value);
        }

        if (isTallyResolution(value)) {
            return visitor.tallyResolution(value);
        }

        return visitor.unknown(value);
    };
}

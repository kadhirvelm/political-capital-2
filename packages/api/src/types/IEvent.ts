/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolutionRid, IActiveStafferRid, IPlayerRid } from "./BrandedIDs";
import { IAllStaffers } from "./generatedStaffers";
import { IVisit } from "./IVisit";

interface IBasicEvent {
    type: string;
}

export interface IStartHiringStaffer extends IBasicEvent {
    playerRid: IPlayerRid;
    recruiterRid: IActiveStafferRid;
    stafferType: Exclude<keyof IAllStaffers, "unknown">;
    type: "start-hiring-staffer";
}

export interface IFinishHiringStaffer extends IBasicEvent {
    playerRid: IPlayerRid;
    recruiterRid: IActiveStafferRid;
    activeStafferRid: IActiveStafferRid;
    type: "finish-hiring-staffer";
}

export interface IStartTrainingStaffer extends IBasicEvent {
    playerRid: IPlayerRid;
    trainerRid: IActiveStafferRid;
    activeStafferRid: IActiveStafferRid;
    toLevel: Exclude<keyof IAllStaffers, "unknown">;
    type: "start-training-staffer";
}

export interface IFinishTrainingStaffer extends IBasicEvent {
    playerRid: IPlayerRid;
    trainerRid: IActiveStafferRid;
    activeStafferRid: IActiveStafferRid;
    type: "finish-training-staffer";
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
    startTrainingStaffer: IStartTrainingStaffer;
    finishTrainingStaffer: IFinishTrainingStaffer;
    newResolution: INewResolution;
    tallyResolution: ITallyResolution;
    unknown: never;
}

export type IPossibleEvent = IAllEvents[keyof IAllEvents];

export namespace IEvent {
    export const isStartHireStaffer = (event: IPossibleEvent): event is IStartHiringStaffer => {
        return event.type === "start-hiring-staffer";
    };

    export const isFinishHiringStaffer = (event: IPossibleEvent): event is IFinishHiringStaffer => {
        return event.type === "finish-hiring-staffer";
    };

    export const isStartTrainingStaffer = (event: IPossibleEvent): event is IStartTrainingStaffer => {
        return event.type === "start-training-staffer";
    };

    export const isFinishTrainingStaffer = (event: IPossibleEvent): event is IFinishTrainingStaffer => {
        return event.type === "finish-hiring-staffer";
    };

    export const isNewResolution = (event: IPossibleEvent): event is INewResolution => {
        return event.type === "new-resolution";
    };

    export const isTallyResolution = (event: IPossibleEvent): event is ITallyResolution => {
        return event.type === "tally-resolution";
    };

    export const visit = <ReturnValue>(value: IPossibleEvent, visitor: IVisit<IAllEvents, ReturnValue>) => {
        if (isStartHireStaffer(value)) {
            return visitor.startHiringStaffer(value);
        }

        if (isFinishHiringStaffer(value)) {
            return visitor.finishHiringStaffer(value);
        }

        if (isStartTrainingStaffer(value)) {
            return visitor.startTrainingStaffer(value);
        }

        if (isFinishTrainingStaffer(value)) {
            return visitor.finishTrainingStaffer(value);
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

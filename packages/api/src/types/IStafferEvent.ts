/**
 * Copyright (c) 2022 - KM
 */

import { IActiveStafferRid, IGameClock } from "./BrandedIDs";
import { IVisit } from "./IVisit";

export interface IBasicEvent {
    displayName: string;
    description: string;
    type: string;
}

export interface IHiredEvent extends IBasicEvent {
    hiredOn: IGameClock;
    type: "hired-on";
}

export interface IBlackmailEvent extends IBasicEvent {
    displayName: "Blackmailed";
    byStafferRid: IActiveStafferRid;
    type: "blackmail-event";
}

interface IAllStafferEvents {
    hiredOn: IHiredEvent;
    blackmailEvent: IBlackmailEvent;
    unknown: never;
}

export type IPossibleStafferEvent = IAllStafferEvents[keyof IAllStafferEvents];

export namespace IStafferEvent {
    export const isHiredOn = (stafferEvent: IPossibleStafferEvent): stafferEvent is IHiredEvent => {
        return stafferEvent.type === "hired-on";
    };

    export const isBlackmailEvent = (stafferEvent: IPossibleStafferEvent): stafferEvent is IBlackmailEvent => {
        return stafferEvent.type === "blackmail-event";
    };

    export const visit = <ReturnValue>(
        value: IPossibleStafferEvent,
        visitor: IVisit<IAllStafferEvents, ReturnValue>,
    ) => {
        if (isHiredOn(value)) {
            return visitor.hiredOn(value);
        }

        if (isBlackmailEvent(value)) {
            return visitor.blackmailEvent(value);
        }

        return visitor.unknown(value);
    };
}

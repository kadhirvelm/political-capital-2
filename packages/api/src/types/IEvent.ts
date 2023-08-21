/*
 * Copyright 2023 KM.
 */

import { type IActiveResolutionRid, type IActiveStafferRid, type IPlayerRid } from "./BrandedIDs";
import { type IAllStaffers } from "./generatedStaffers";
import { type GenericType, type VisitorPattern } from "./visit";

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
  activeStafferRid: IActiveStafferRid;
  playerRid: IPlayerRid;
  recruiterRid: IActiveStafferRid;
  type: "finish-hiring-staffer";
}

export interface IStartTrainingStaffer extends IBasicEvent {
  activeStafferRid: IActiveStafferRid;
  playerRid: IPlayerRid;
  toLevel: Exclude<keyof IAllStaffers, "unknown">;
  trainerRid: IActiveStafferRid;
  type: "start-training-staffer";
}

export interface IFinishTrainingStaffer extends IBasicEvent {
  activeStafferRid: IActiveStafferRid;
  playerRid: IPlayerRid;
  trainerRid: IActiveStafferRid;
  type: "finish-training-staffer";
}

export interface IPayoutEarlyVoting extends IBasicEvent {
  activeStafferRid: IActiveStafferRid;
  onActiveResolutionRid: IActiveResolutionRid;
  playerRid: IPlayerRid;
  type: "payout-early-voting";
}

export interface INewResolution extends IBasicEvent {
  type: "new-resolution";
}

export interface ITallyResolution extends IBasicEvent {
  activeResolutionRid: IActiveResolutionRid;
  type: "tally-resolution";
}

export interface IAllEvents {
  finishHiringStaffer: IFinishHiringStaffer;
  finishTrainingStaffer: IFinishTrainingStaffer;
  newResolution: INewResolution;
  payoutEarlyVoting: IPayoutEarlyVoting;
  startHiringStaffer: IStartHiringStaffer;
  startTrainingStaffer: IStartTrainingStaffer;
  tallyResolution: ITallyResolution;
}

export type IPossibleEvent = GenericType<IAllEvents>;

export const IEvent: VisitorPattern<IAllEvents> = {
  typeChecks: {
    finishHiringStaffer: (event: IPossibleEvent): event is IFinishHiringStaffer => {
      return event.type === "finish-hiring-staffer";
    },

    finishTrainingStaffer: (event: IPossibleEvent): event is IFinishTrainingStaffer => {
      return event.type === "finish-training-staffer";
    },

    newResolution: (event: IPossibleEvent): event is INewResolution => {
      return event.type === "new-resolution";
    },

    payoutEarlyVoting: (event: IPossibleEvent): event is IPayoutEarlyVoting => {
      return event.type === "payout-early-voting";
    },

    startHiringStaffer: (event: IPossibleEvent): event is IStartHiringStaffer => {
      return event.type === "start-hiring-staffer";
    },

    startTrainingStaffer: (event: IPossibleEvent): event is IStartTrainingStaffer => {
      return event.type === "start-training-staffer";
    },

    tallyResolution: (event: IPossibleEvent): event is ITallyResolution => {
      return event.type === "tally-resolution";
    },
  },
  visit: (value, visitor) => {
    if (IEvent.typeChecks.finishHiringStaffer(value)) {
      return visitor.finishHiringStaffer(value);
    }

    if (IEvent.typeChecks.finishTrainingStaffer(value)) {
      return visitor.finishTrainingStaffer(value);
    }

    if (IEvent.typeChecks.newResolution(value)) {
      return visitor.newResolution(value);
    }

    if (IEvent.typeChecks.payoutEarlyVoting(value)) {
      return visitor.payoutEarlyVoting(value);
    }

    if (IEvent.typeChecks.startHiringStaffer(value)) {
      return visitor.startHiringStaffer(value);
    }

    if (IEvent.typeChecks.startTrainingStaffer(value)) {
      return visitor.startTrainingStaffer(value);
    }

    if (IEvent.typeChecks.tallyResolution(value)) {
      return visitor.tallyResolution(value);
    }

    return visitor.unknown(value);
  },
};

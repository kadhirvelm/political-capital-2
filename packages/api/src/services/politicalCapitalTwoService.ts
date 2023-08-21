/*
 * Copyright 2023 KM.
 */

import { type IImplementEndpoint, type IService } from "../common/generics";
import { type IActiveResolutionRid, type IActiveStafferRid, type IGameStateRid } from "../types/BrandedIDs";
import { type IPossibleEvent, type IStartHiringStaffer, type IStartTrainingStaffer } from "../types/IEvent";
import { type IActiveResolutionVote } from "../types/politicalCapitalTwo";

export interface IPartialResolveGameEvent<Event extends IPossibleEvent> {
  eventDetails: Event;
  gameStateRid: IGameStateRid;
  state: "pending";
}

export interface IPoliticalCapitalTwoService extends IService {
  castVote: {
    payload: {
      activeResolutionRid: IActiveResolutionRid;
      gameStateRid: IGameStateRid;
      vote: IActiveResolutionVote["vote"];
      votingStafferRid: IActiveStafferRid;
    };
    response: {
      votes: IActiveResolutionVote[];
    };
  };
  recruitStaffer: {
    payload: {
      gameStateRid: IGameStateRid;
      recruitRequest: Omit<IStartHiringStaffer, "type">;
    };
    response: {
      pendingEvent: IPartialResolveGameEvent<IStartHiringStaffer>;
    };
  };
  trainStaffer: {
    payload: {
      gameStateRid: IGameStateRid;
      trainRequest: Omit<IStartTrainingStaffer, "type">;
    };
    response: {
      pendingEvent: IPartialResolveGameEvent<IStartTrainingStaffer>;
    };
  };
}

export const PoliticalCapitalTwoService: IImplementEndpoint<IPoliticalCapitalTwoService> = {
  castVote: {
    method: "post",
    slug: "/cast-vote",
  },
  recruitStaffer: {
    method: "post",
    slug: "/recruit-staffer",
  },
  trainStaffer: {
    method: "post",
    slug: "/train-staffer",
  },
};

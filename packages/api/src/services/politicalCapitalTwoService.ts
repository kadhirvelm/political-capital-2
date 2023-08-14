/*
 * Copyright 2023 KM.
 */


import { type IImplementEndpoint, type IService } from "../common/generics";
import { type IActiveResolutionRid, type IActiveStafferRid, type IGameStateRid } from "../types/BrandedIDs";
import { type IPossibleEvent, type IStartHiringStaffer, type IStartTrainingStaffer } from "../types/IEvent";
import { type IActiveResolutionVote } from "../types/politicalCapitalTwo";

export interface IPartialResolveGameEvent<Event extends IPossibleEvent> {
  gameStateRid: IGameStateRid;
  eventDetails: Event;
  state: "pending";
}

export interface IPoliticalCapitalTwoService extends IService {
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
  castVote: {
    payload: {
      gameStateRid: IGameStateRid;
      votingStafferRid: IActiveStafferRid;
      activeResolutionRid: IActiveResolutionRid;
      vote: IActiveResolutionVote["vote"];
    };
    response: {
      votes: IActiveResolutionVote[];
    };
  };
}

export const PlayerCapitalTwoService: IImplementEndpoint<IPoliticalCapitalTwoService> = {
  recruitStaffer: {
    method: "post",
    slug: "/recruit-staffer",
  },
  castVote: {
        method: "post",
        slug: "/cast-vote",
    },
    trainStaffer: {
        method: "post",
        slug: "/train-staffer",
    },
};

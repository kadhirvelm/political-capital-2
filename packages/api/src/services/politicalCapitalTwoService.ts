/**
 * Copyright (c) 2022 - KM
 */

import { implementEndpoints, IService } from "../common/generics";
import { IActiveResolutionRid, IActiveStafferRid, IGameStateRid } from "../types/BrandedIDs";
import { IPossibleEvent, IStartHiringStaffer, IStartTrainingStaffer } from "../types/IEvent";
import { IActiveResolutionVote } from "../types/politicalCapitalTwo";

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
            votes: IActiveResolutionVote["vote"][];
        };
        response: {
            votes: IActiveResolutionVote[];
        };
    };
}

const { backend, frontend } = implementEndpoints<IPoliticalCapitalTwoService>({
    recruitStaffer: {
        method: "post",
        slug: "/recruit-staffer",
    },
    trainStaffer: {
        method: "post",
        slug: "/train-staffer",
    },
    castVote: {
        method: "post",
        slug: "/cast-vote",
    },
});

export const PoliticalCapitalTwoServiceBackend = backend;
export const PoliticalCapitalTwoServiceFrontend = frontend;

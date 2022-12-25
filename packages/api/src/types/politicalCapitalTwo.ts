/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolutionRid, IActiveStafferRid, IGameClock, IGameStateRid, IPlayerRid } from "./BrandedIDs";
import { IPossibleEvent } from "./IEvent";
import { IPossibleResolution } from "./IResolution";
import { IPossibleStaffer } from "./IStaffer";

export interface IPlayer {
    playerRid: IPlayerRid;
    browserIdentifier: string;
    name: string;
}

export interface IGameState {
    gameStateRid: IGameStateRid;
    state: "waiting" | "active" | "paused" | "complete";
    gameClock: IGameClock;
}

export interface IActivePlayer {
    gameStateRid: IGameStateRid;
    playerRid: IPlayerRid;
    politicalCapital: number;
    approvalRating: number;
    lastUpdatedGameClock: IGameClock;
    isReady: boolean;
}

export interface IActiveResolution {
    gameStateRid: IGameStateRid;
    activeResolutionRid: IActiveResolutionRid;
    resolutionDetails: IPossibleResolution;
    state: "active" | "passed" | "failed";
}

export interface IActiveResolutionVote {
    gameStateRid: IGameStateRid;
    activeResolutionRid: IActiveResolutionRid;
    activeStafferRid: IActiveStafferRid;
    vote: "inFavor" | "against" | "abstain";
}

export interface IActiveStaffer {
    gameStateRid: IGameStateRid;
    playerRid: IPlayerRid;
    activeStafferRid: IActiveStafferRid;
    stafferDetails: IPossibleStaffer;
    state: "active" | "disabled";
}

export interface IResolveGameEvent {
    gameStateRid: IGameStateRid;
    resolvesOn: IGameClock;
    eventDetails: IPossibleEvent;
    state: "active" | "complete";
}

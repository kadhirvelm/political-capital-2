/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolutionRid, IActiveStafferRid, IGameClock, IGameStateRid, IPlayerRid } from "./BrandedIDs";
import { IPossibleStaffer } from "./generatedStaffers";
import { IPossibleEvent } from "./IEvent";
import { IBasicResolution } from "./IResolution";
import { IGameModifier } from "./IGameModifier";

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

export type IAvatarSet = "robots" | "monsters" | "cats" | "humans";
export const AvatarSet: IAvatarSet[] = ["robots", "monsters", "cats", "humans"];

export interface IActivePlayer {
    gameStateRid: IGameStateRid;
    playerRid: IPlayerRid;
    politicalCapital: number;
    approvalRating: number;
    avatarSet: IAvatarSet;
    lastUpdatedGameClock: IGameClock;
    isReady: boolean;
}

export interface IActiveResolution {
    gameStateRid: IGameStateRid;
    activeResolutionRid: IActiveResolutionRid;
    resolutionDetails: IBasicResolution;
    state: "active" | "passed" | "failed";
    createdOn: IGameClock;
}

export interface IActiveResolutionVote {
    gameStateRid: IGameStateRid;
    activeResolutionRid: IActiveResolutionRid;
    activeStafferRid: IActiveStafferRid;
    vote: "passed" | "failed" | "abstain";
}

export interface IActiveStaffer {
    gameStateRid: IGameStateRid;
    playerRid: IPlayerRid;
    activeStafferRid: IActiveStafferRid;
    stafferDetails: IPossibleStaffer;
    avatarSet: IAvatarSet;
    state: "active" | "disabled";
}

export interface IResolveGameEvent {
    gameStateRid: IGameStateRid;
    resolvesOn: IGameClock;
    eventDetails: IPossibleEvent;
    state: "active" | "complete";
}

export interface IPassedGameModifier {
    gameStateRid: IGameStateRid;
    fromActiveResolutionRid: IActiveResolutionRid;
    modifier: IGameModifier;
    createdOn: IGameClock;
}

export interface IHistoricalGameState {
    gameStateRid: IGameStateRid;
    gameClock: IGameClock;
    snapshot: Array<{ playerRid: IPlayerRid; politicalCapital: number }>;
}

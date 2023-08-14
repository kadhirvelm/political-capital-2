/*
 * Copyright 2023 KM.
 */

import {
  type IActiveResolutionRid,
  type IActiveStafferRid,
  type IGameClock,
  type IGameStateRid,
  type IActiveNotificationRid,
  type IPlayerRid,
} from "./BrandedIDs";
import { type IPossibleStaffer } from "./generatedStaffers";
import { type IPossibleEvent } from "./IEvent";
import { type IBasicResolution } from "./IResolution";
import { type IGameModifier } from "./IGameModifier";
import { type IPossibleNotification } from "./INotification";

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
  vote: "passed" | "failed";
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

export interface IActivePlayerModifier {
  modifier: IGameModifier;
  createdOn: IGameClock;
}

export interface IHistoricalGameState {
  gameStateRid: IGameStateRid;
  gameClock: IGameClock;
  snapshot: Array<{ playerRid: IPlayerRid; politicalCapital: number }>;
}

export interface IActiveNotification {
  activeNotificationRid: IActiveNotificationRid;
  gameStateRid: IGameStateRid;
  notificationDetails: IPossibleNotification;
  toPlayerRid: IPlayerRid;
  createdOn: IGameClock;
  status: "unread" | "read";
}

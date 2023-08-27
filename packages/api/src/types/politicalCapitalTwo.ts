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
  browserIdentifier: string;
  name: string;
  playerRid: IPlayerRid;
}

export interface IGameState {
  gameClock: IGameClock;
  gameStateRid: IGameStateRid;
  state: "waiting" | "active" | "paused" | "complete";
}

export type IAvatarSet = "robots" | "monsters" | "cats" | "humans";
export const AvatarSet: IAvatarSet[] = ["robots", "monsters", "cats", "humans"];

export interface IActivePlayer {
  approvalRating: number;
  avatarSet: IAvatarSet;
  gameStateRid: IGameStateRid;
  isReady: boolean;
  lastUpdatedGameClock: IGameClock;
  playerRid: IPlayerRid;
  politicalCapital: number;
}

export interface IActiveResolution {
  activeResolutionRid: IActiveResolutionRid;
  createdOn: IGameClock;
  gameStateRid: IGameStateRid;
  resolutionDetails: IBasicResolution;
  state: "active" | "passed" | "failed";
}

export interface IActiveResolutionVote {
  activeResolutionRid: IActiveResolutionRid;
  activeStafferRid: IActiveStafferRid;
  gameStateRid: IGameStateRid;
  vote: "passed" | "failed";
}

export interface IActiveStaffer {
  activeStafferRid: IActiveStafferRid;
  avatarSet: IAvatarSet;
  gameStateRid: IGameStateRid;
  playerRid: IPlayerRid;
  stafferDetails: IPossibleStaffer;
  state: "active" | "disabled";
}

export interface IResolveGameEvent {
  eventDetails: IPossibleEvent;
  gameStateRid: IGameStateRid;
  resolvesOn: IGameClock;
  state: "active" | "complete";
}

export interface IPassedGameModifier {
  createdOn: IGameClock;
  fromActiveResolutionRid: IActiveResolutionRid;
  gameStateRid: IGameStateRid;
  modifier: IGameModifier;
}

export interface IActivePlayerModifier {
  createdOn: IGameClock;
  modifier: IGameModifier;
}

export interface IHistoricalGameState {
  gameClock: IGameClock;
  gameStateRid: IGameStateRid;
  snapshot: Array<{ playerRid: IPlayerRid; politicalCapital: number }>;
}

export interface IActiveNotification {
  activeNotificationRid: IActiveNotificationRid;
  createdOn: IGameClock;
  gameStateRid: IGameStateRid;
  notificationDetails: IPossibleNotification;
  status: "unread" | "read";
  toPlayerRid: IPlayerRid;
}

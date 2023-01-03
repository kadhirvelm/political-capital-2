/**
 * Copyright (c) 2022 - KM
 */

export type IPlayerRid = string & { _brand: "playerRid" };

export type IGlobalScreenIdentifier = string & { _brand: "globalScreenIdentifier" };

export type IGameStateRid = string & { _brand: "gameStateRid" };

export type IGameClock = number & { _brand: "game-clock-count" };

export type IActiveResolutionRid = string & { _brand: "activeResolutionRid" };

export type IActiveStafferRid = string & { _brand: "activeStafferRid" };

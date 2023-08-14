/*
 * Copyright 2023 KM.
 */

import { type IPossibleStaffer } from "./generatedStaffers";

export type IStafferCategory = "voter" | "generator" | "recruit" | "trainer" | "shadowGovernment";

interface IBasicEffect {
  type: string;
}

export interface IStafferEffect extends IBasicEffect {
  /** The staffers that are affected. You can also specify categories in addition to specific staffer types. */
  staffersAffected: Array<IPossibleStaffer["type"] | IStafferCategory | "everyone">;
  /** Percent multiplier on the total political capital cost to acquire the staffer */
  costToAcquire?: number;
  /** Percent multiplier on the total time to acquire the staffer */
  timeToAcquire?: number;
  /** Percent multiplier on whatever the staffer does, i.e. votes, political capital generation, staffers that they can hire, train, etc. Do not add effectiveness on top of shadow government, it does not make sense */
  effectiveness?: number;
  /** If true, prevents this type of staffer from being hired for the rest of the round. */
  disableHiring?: boolean;
  /** If true, prevents training this type of staffer for the rest of the round. */
  disableTraining?: boolean;
  type: "staffer-effect";
}

export interface IResolutionEffect extends IBasicEffect {
  /** Percent multiplier on the time for each resolution. */
  timePerResolution?: number;
  /** Percent multiplier on the time between resolutions. */
  timeBetweenResolutions?: number;
  /** A percent multiplier on the political capital payout for future resolutions, including this one. */
  payoutPerResolution?: number;
  /** Changes the payout per player */
  payoutPerPlayer?: number;
  /** Change the early voting bonus */
  earlyVotingBonus?: number;
  type: "resolution-effect";
}

// Type of resolution that ends the game early
// Change the amount of time for resolutions based on number of players

export type IGameModifier = IStafferEffect | IResolutionEffect;

/**
 * Copyright (c) 2022 - KM
 */

import { IPossibleStaffer } from "./generatedStaffers";

export interface IStafferEffect {
    /** The staffers that are affected. You can also specify categories in addition to specific staffer types. */
    staffersAffected: Array<IPossibleStaffer["type"] | "voter" | "generator" | "recruit" | "trainer" | "everyone">;
    /** Percent multiplier on the total political capital cost to acquire the staffer */
    costToAcquire?: number;
    /** Percent multiplier on the total time to acquire the staffer */
    timeToAcquire?: number;
    /** Percent multiplier on whatever the staffer does, i.e. votes, political capital generation, staffers that they can hire, train, etc. */
    effectiveness?: number;
    /** If true, prevents this type of staffer from being hired for the rest of the round. */
    disableHiring?: boolean;
    /** If true, prevents training this type of staffer for the rest of the round. */
    disableTraining?: boolean;
    /** If true, removes all instances of this staffer by disabling them. */
    removeAll?: boolean;
    type: "staffer-effect";
}

export interface IResolutionEffect {
    /** The time for each resolution. */
    timePerResolution?: number;
    /** The time between the results of one resolution being announced and the next one starting. */
    timeBetweenResolutions?: number;
    /** A percent multiplier on the political capital payout for future resolutions, including this one. */
    payoutPerResolution?: number;
    type: "resolution-effect";
}

export type IGameModifier = IStafferEffect | IResolutionEffect;

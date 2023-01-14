/**
 * Copyright (c) 2022 - KM
 */

import { IAllStaffers } from "../types/generatedStaffers";
import { IResolutionEffect, IStafferEffect } from "../types/IGameModifier";

export const TIME_BETWEEN_RESOLUTIONS_IN_DAYS = 4;

export const TIME_FOR_EACH_RESOLUTION_IN_DAYS = 28;

export const TOTAL_DAYS_IN_GAME = 365;

export const INITIAL_STAFFERS: Array<Exclude<keyof IAllStaffers, "unknown">> = [
    "representative",
    "representative",
    "recruiter",
    "adjunctInstructor",
];

export const ACCOUNTANT_MODIFIER: IStafferEffect = {
    staffersAffected: ["everyone"],
    costToAcquire: -0.2,
    type: "staffer-effect",
};

export const CHIEF_OF_STAFF_MODIFIER: IStafferEffect = {
    staffersAffected: ["everyone"],
    timeToAcquire: -0.15,
    type: "staffer-effect",
};

export const LOBBYIST_MODIFIER: IResolutionEffect = {
    payoutPerPlayer: 0.1,
    type: "resolution-effect",
};

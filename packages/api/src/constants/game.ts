/**
 * Copyright (c) 2022 - KM
 */

import { IResolutionEffect, IStafferEffect } from "../types/IGameModifier";

export const TIME_BETWEEN_RESOLUTIONS_IN_DAYS = 6;

export const TIME_FOR_EACH_RESOLUTION_IN_DAYS = 30;

export const MINIMUM_EARLY_VOTING_DAYS = 3;

export const MAX_EARLY_VOTING_BONUS = 6;

export const TOTAL_DAYS_IN_GAME = 365;

export const BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER = 25;

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
    earlyVotingBonus: 0.1,
    type: "resolution-effect",
};

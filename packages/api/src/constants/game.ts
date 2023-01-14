/**
 * Copyright (c) 2022 - KM
 */

import { IAllStaffers } from "../types/generatedStaffers";

export const TIME_BETWEEN_RESOLUTIONS_IN_DAYS = 4;

export const TIME_FOR_EACH_RESOLUTION_IN_DAYS = 28;

export const TOTAL_DAYS_IN_GAME = 365;

export const INITIAL_STAFFERS: Array<Exclude<keyof IAllStaffers, "unknown">> = [
    "representative",
    "representative",
    "recruiter",
    "adjunctInstructor",
];

/*
 * Copyright 2023 KM.
 */

import { type IAllStaffers } from "../types/generatedStaffers";

export const INITIAL_POLITICAL_CAPITAL = 10;

export const INITIAL_APPROVAL_RATING = 50;

export const INITIAL_STAFFERS: Array<Exclude<keyof IAllStaffers, "unknown">> = [
  "representative",
  "representative",
  "recruiter",
  "adjunctInstructor",
];

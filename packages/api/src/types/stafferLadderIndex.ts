/*
 * Copyright 2023 KM.
 */

import { DEFAULT_STAFFER, type IAllStaffers } from "./generatedStaffers";

export const StafferLadderIndex: { [stafferType: string]: Array<Exclude<keyof IAllStaffers, "unknown">> } = (() => {
  const stafferIndex: { [stafferType: string]: Array<Exclude<keyof IAllStaffers, "unknown">> } = {};

  for (const staffer of Object.values(DEFAULT_STAFFER)) {
    for (const upgradedFrom of staffer.upgradedFrom) {
      stafferIndex[upgradedFrom] = stafferIndex[upgradedFrom] ?? [];
      stafferIndex[upgradedFrom].push(staffer.type);
    }
  }

  return stafferIndex;
})();

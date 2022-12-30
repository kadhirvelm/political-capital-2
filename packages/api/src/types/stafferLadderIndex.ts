/**
 * Copyright (c) 2022 - KM
 */

import { DEFAULT_STAFFER, IAllStaffers } from "./generatedStaffers";

export const StafferLadderIndex: { [stafferType: string]: Array<Exclude<keyof IAllStaffers, "unknown">> } = (() => {
    const stafferIndex: { [stafferType: string]: Array<Exclude<keyof IAllStaffers, "unknown">> } = {};

    Object.values(DEFAULT_STAFFER).forEach((staffer) => {
        staffer.upgradedFrom.forEach((upgradedFrom) => {
            stafferIndex[upgradedFrom] = stafferIndex[upgradedFrom] ?? [];
            stafferIndex[upgradedFrom].push(staffer.type);
        });
    });

    return stafferIndex;
})();

/**
 * Copyright (c) 2022 - KM
 */

import { IActiveStaffer, IPossibleStaffer } from "@pc2/api";

export const voting: Array<IPossibleStaffer["type"]> = ["representative", "seniorRepresentative"];
export const generator: Array<IPossibleStaffer["type"]> = ["phoneBanker"];

export type IStafferCategory = "voting" | "generator" | "support";

export function getStafferCategory(staffer: IPossibleStaffer): IStafferCategory {
    if (voting.includes(staffer.type)) {
        return "voting";
    }

    if (generator.includes(staffer.type)) {
        return "generator";
    }

    return "support";
}

export function getStaffersOfCategory(activeStaffers: IActiveStaffer[], category: IStafferCategory) {
    return activeStaffers.slice().filter((activeStaffer) => {
        return getStafferCategory(activeStaffer.stafferDetails) === category;
    });
}

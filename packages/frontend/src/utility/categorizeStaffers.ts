/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getStafferCategory,
    getStafferDetails,
    IActiveOrPossibleStaffer,
    IActiveStaffer,
    IStafferCategory,
    StafferLadderIndex,
} from "@pc2/api";
import { IResolvedGameModifiers } from "../selectors/gameModifiers";
import { getEffectivenessNumber } from "./gameModifiers";

export function getStaffersOfCategory(
    activeStaffers: IActiveStaffer[],
    category: IStafferCategory | undefined,
    gameModifiers: IResolvedGameModifiers,
) {
    return activeStaffers
        .slice()
        .filter((activeStaffer) => {
            return getStafferCategory(activeStaffer.stafferDetails) === category;
        })
        .sort((a, b) => {
            if (a.state !== b.state) {
                return a.state.localeCompare(b.state);
            }

            const defaultCompare = a.stafferDetails.type.localeCompare(b.stafferDetails.type);

            const aEffectiveness = getEffectivenessNumber(gameModifiers, a.stafferDetails.type);
            const bEffectiveness = getEffectivenessNumber(gameModifiers, a.stafferDetails.type);

            return aEffectiveness === bEffectiveness ? defaultCompare : aEffectiveness > bEffectiveness ? -1 : 1;
        });
}

export function getTrainsIntoDisplayName(staffer: IActiveOrPossibleStaffer): string[] {
    const stafferDetails = getStafferDetails(staffer);

    return StafferLadderIndex[stafferDetails.type].map(
        (type: keyof typeof DEFAULT_STAFFER) => DEFAULT_STAFFER[type].displayName,
    );
}

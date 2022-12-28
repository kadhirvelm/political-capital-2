/**
 * Copyright (c) 2022 - KM
 */

import { DEFAULT_STAFFER, IAllStaffers, IPossibleStaffer } from "@pc2/api";
import { names, uniqueNamesGenerator } from "unique-names-generator";

export function getStafferOfType(staffer: keyof IAllStaffers): IPossibleStaffer {
    const defaultStaffer = DEFAULT_STAFFER[staffer];

    return {
        ...defaultStaffer,
        displayName: uniqueNamesGenerator({ dictionaries: [names], separator: " " }),
    };
}

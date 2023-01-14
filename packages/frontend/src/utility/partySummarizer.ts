/**
 * Copyright (c) 2022 - KM
 */

import { getStafferDetails, IActiveStaffer, isGenerator, isRecruit, isTrainer, isVoter } from "@pc2/api";
import { IResolvedGameModifiersForEachStaffer } from "../selectors/gameModifiers";

export function summaryStaffers(staffers: IActiveStaffer[], gameModifiers: IResolvedGameModifiersForEachStaffer) {
    let votingCapacity = 0;
    let generator = 0;
    let hiring = 0;
    let training = 0;

    staffers.forEach((staffer) => {
        const stafferDetails = getStafferDetails(staffer);
        if (staffer.state !== "active") {
            return;
        }

        const effectiveness = gameModifiers[staffer.stafferDetails.type].effectiveness;

        if (isVoter(stafferDetails)) {
            votingCapacity += effectiveness;
        }

        if (isGenerator(stafferDetails)) {
            generator += effectiveness;
        }

        if (isRecruit(stafferDetails)) {
            hiring += effectiveness;
        }

        if (isTrainer(stafferDetails)) {
            training += effectiveness;
        }
    });

    return {
        votingCapacity,
        generator,
        hiring,
        training,
    };
}

/**
 * Copyright (c) 2022 - KM
 */

import { getStafferDetails, IActiveStaffer, isGenerator, isRecruit, isTrainer, isVoter } from "@pc2/api";
import { IResolvedGameModifiers } from "../selectors/gameModifiers";
import { getEffectivenessNumber } from "./gameModifiers";

export function summaryStaffers(staffers: IActiveStaffer[], gameModifiers: IResolvedGameModifiers) {
    let votingCapacity = 0;
    let generator = 0;
    let hiring = 0;
    let training = 0;

    staffers.forEach((staffer) => {
        const stafferDetails = getStafferDetails(staffer);
        if (staffer.state !== "active") {
            return;
        }

        if (isVoter(stafferDetails)) {
            votingCapacity += getEffectivenessNumber(gameModifiers, staffer.stafferDetails.type);
        }

        if (isGenerator(stafferDetails)) {
            generator += getEffectivenessNumber(gameModifiers, staffer.stafferDetails.type);
        }

        if (isRecruit(stafferDetails)) {
            hiring += getEffectivenessNumber(gameModifiers, staffer.stafferDetails.type);
        }

        if (isTrainer(stafferDetails)) {
            training += getEffectivenessNumber(gameModifiers, staffer.stafferDetails.type);
        }
    });

    return {
        votingCapacity,
        generator,
        hiring,
        training,
    };
}

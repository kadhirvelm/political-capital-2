/**
 * Copyright (c) 2022 - KM
 */

import { IActiveStaffer, IPlayerRid, getStafferDetails, isVoter, isGenerator, isRecruit, isTrainer } from "@pc2/api";
import { IUserFacingIndexedResolveEvents } from "../store/gameState";
import { isSurfaceLevelBusy } from "./isStafferBusy";

export function summaryStaffers(
    staffers: IActiveStaffer[],
    resolveEvents: IUserFacingIndexedResolveEvents | undefined,
    playerRid: IPlayerRid,
) {
    let votingCapacity = 0;
    let generator = 0;
    let hiring = 0;
    let training = 0;

    staffers.forEach((staffer) => {
        const stafferDetails = getStafferDetails(staffer);
        if (isSurfaceLevelBusy(staffer, resolveEvents, playerRid)) {
            return;
        }

        if (isVoter(stafferDetails)) {
            votingCapacity += stafferDetails.votes;
        }

        if (isGenerator(stafferDetails)) {
            generator += stafferDetails.payout;
        }

        if (isRecruit(stafferDetails)) {
            hiring += stafferDetails.recruitCapacity;
        }

        if (isTrainer(stafferDetails)) {
            training += stafferDetails.trainingCapacity;
        }
    });

    return {
        votingCapacity,
        generator,
        hiring,
        training,
    };
}

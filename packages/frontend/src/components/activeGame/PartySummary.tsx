/**
 * Copyright (c) 2022 - KM
 */

import { getStafferDetails, IActiveStaffer, IPlayerRid, isGenerator, isRecruit, isTrainer, isVoter } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { IUserFacingIndexedResolveEvents } from "../../store/gameState";
import { isSurfaceLevelBusy } from "../../utility/isStafferBusy";
import { roundToThousand } from "../../utility/roundTo";
import styles from "./PartySummary.module.scss";

function summaryStaffers(
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

export const PartySummary: React.FC<{ playerRid: IPlayerRid }> = ({ playerRid }) => {
    const maybePlayerStaffers = usePoliticalCapitalSelector(
        (s) => s.localGameState.fullGameState?.activePlayersStaffers[playerRid],
    );
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

    if (maybePlayerStaffers === undefined) {
        return null;
    }

    const { votingCapacity, generator, hiring, training } = summaryStaffers(
        maybePlayerStaffers,
        resolveEvents,
        playerRid,
    );

    return (
        <div className={styles.summaryContainer}>
            <div className={styles.summaryText}>Summary</div>
            <div className={styles.singleSummary}>
                <div className={styles.value}>{votingCapacity}</div>
                <div>votes,</div>
            </div>
            <div className={styles.singleSummary}>
                <div className={styles.value}>{roundToThousand(generator).toLocaleString()}</div>
                <div>PC / day,</div>
            </div>
            <div className={styles.singleSummary}>
                <div className={styles.value}>{hiring}</div>
                <div>hiring,</div>
            </div>
            <div className={styles.singleSummary}>
                <div className={styles.value}>{training}</div>
                <div>training</div>
            </div>
        </div>
    );
};

/**
 * Copyright (c) 2022 - KM
 */

import { IPlayerRid } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { summaryStaffers } from "../../utility/partySummarizer";
import { roundToThousand } from "../../utility/roundTo";
import styles from "./PartySummary.module.scss";

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

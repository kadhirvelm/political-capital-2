/**
 * Copyright (c) 2022 - KM
 */

import { IPlayerRid } from "@pc2/api";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { summaryStaffers } from "../../utility/partySummarizer";
import { roundToThousand } from "../../utility/roundTo";
import styles from "./PartySummary.module.scss";
import { FC } from "react";

export const PartySummary: FC<{ playerRid: IPlayerRid }> = ({ playerRid }) => {
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

    if (fullGameState === undefined) {
        return null;
    }

    const { votingCapacity, generator, hiring, training } = summaryStaffers(
        fullGameState.activePlayersStaffers[playerRid],
        resolvedGameModifiers,
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

/**
 * Copyright (c) 2022 - KM
 */

import { DEFAULT_STAFFER, IAllStaffers, IPossibleStaffer } from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { getStafferCategory } from "../../utility/categorizeStaffers";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import styles from "./StafferLadders.module.scss";

export const StafferLadders: React.FC<{}> = () => {
    const allStaffers = Object.values(DEFAULT_STAFFER);

    const renderSingleStafferLevel = (staffer: IPossibleStaffer) => {
        const parents = allStaffers.filter((s) => (s.upgradedFrom as Array<keyof IAllStaffers>).includes(staffer.type));
        const stafferCategory = getStafferCategory(staffer);

        return (
            <div className={styles.singleLevel}>
                <div
                    className={classNames(styles.singleLevelDetails, {
                        [styles.voting]: stafferCategory === "voting",
                        [styles.generator]: stafferCategory === "generator",
                        [styles.support]: stafferCategory === "support",
                    })}
                >
                    <div>
                        {staffer.displayName} ({staffer.costToAcquire} PC, {staffer.timeToAcquire} days)
                    </div>
                    <div className={styles.description}>{descriptionOfStaffer[staffer.type]}</div>
                </div>
                <div className={styles.singleLevelParents}>{parents.map(renderSingleStafferLevel)}</div>
            </div>
        );
    };

    const lowestLevelStaffers = allStaffers.filter((staffer) => staffer.upgradedFrom.length === 0);

    return (
        <div className={styles.staffersContainer}>
            <div className={styles.legend}>
                <div className={styles.generatorText}>Generator</div>
                <div className={styles.supportText}>Support</div>
                <div className={styles.votingText}>Voting</div>
            </div>
            {lowestLevelStaffers.map(renderSingleStafferLevel)}
        </div>
    );
};

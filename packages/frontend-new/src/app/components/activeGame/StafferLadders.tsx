/**
 * Copyright (c) 2022 - KM
 */

import { DEFAULT_STAFFER, getStafferCategory, IAllStaffers, IPossibleStaffer } from "@pc2/api";
import classNames from "classnames";

import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import styles from "./StafferLadders.module.scss";
import { FC } from "react";

export const StafferLadders: FC<{}> = () => {
    const allStaffers = Object.values(DEFAULT_STAFFER);

    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

    const renderSingleStafferLevel = (
        staffer: IPossibleStaffer,
        hasParent: boolean,
        isFirstLine: boolean,
        isLastLine: boolean,
    ) => {
        const children = allStaffers.filter((s) =>
            (s.upgradedFrom as Array<keyof IAllStaffers>).includes(staffer.type),
        );
        const stafferCategory = getStafferCategory(staffer);

        const finalCostToAcquire = resolvedGameModifiers[staffer.type].costToAcquire;
        const finalTimeToAcquire = resolvedGameModifiers[staffer.type].timeToAcquire;

        return (
            <div className={styles.withIndicator} key={staffer.displayName}>
                {hasParent && (
                    <div
                        className={classNames(styles.topHalf, {
                            [styles.firstLine]: isFirstLine,
                            [styles.lastLine]: isLastLine,
                        })}
                    >
                        <div className={styles.topHalfLine} />
                    </div>
                )}
                <div className={styles.singleLevel}>
                    <div
                        className={classNames(styles.singleLevelDetails, {
                            [styles.noCategory]: stafferCategory === undefined,
                            [styles.voter]: stafferCategory === "voter",
                            [styles.generator]: stafferCategory === "generator",
                            [styles.trainer]: stafferCategory === "trainer",
                            [styles.recruit]: stafferCategory === "recruit",
                            [styles.shadowGovernment]: stafferCategory === "shadowGovernment",
                        })}
                    >
                        <div>
                            {staffer.displayName} ({finalCostToAcquire.toLocaleString()} PC, {finalTimeToAcquire} days)
                        </div>
                        <div className={styles.description}>
                            {descriptionOfStaffer(resolvedGameModifiers)[staffer.type]}
                        </div>
                        {staffer.limitPerParty !== undefined && (
                            <div className={styles.description}>Limited to {staffer.limitPerParty} per party </div>
                        )}
                    </div>
                    <div className={styles.singleLevelParents}>
                        {children.map((c, index) =>
                            renderSingleStafferLevel(c, true, index === 0, index === children.length - 1),
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const lowestLevelStaffers = allStaffers.filter((staffer) => staffer.upgradedFrom.length === 0);

    return (
        <div className={styles.staffersContainer}>
            <div className={styles.legend}>
                <div className={classNames(styles.voter, styles.tagContainer)}>Voter</div>
                <div className={classNames(styles.generator, styles.tagContainer)}>Generator</div>
                <div className={classNames(styles.trainer, styles.tagContainer)}>Trainer</div>
                <div className={classNames(styles.recruit, styles.tagContainer)}>Recruiter</div>
                <div className={classNames(styles.shadowGovernment, styles.tagContainer)}>Shadow government</div>
                <div className={classNames(styles.noCategory, styles.tagContainer)}>None</div>
            </div>
            {lowestLevelStaffers.map((s) => renderSingleStafferLevel(s, false, true, false))}
        </div>
    );
};

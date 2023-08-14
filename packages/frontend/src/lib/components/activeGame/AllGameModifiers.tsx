/**
 * Copyright (c) 2022 - KM
 */

import { gameModifiersWithResolution } from "../../selectors/gameModifiers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getFakeDate } from "../common/ServerStatus";
import { GameModifier } from "./GameModifier";
import styles from "./AllGameModifiers.module.scss";
import { FC } from "react";

export const AllGameModifiers: FC<{}> = () => {
    const allGameModifiers = usePoliticalCapitalSelector(gameModifiersWithResolution);

    if (allGameModifiers === undefined || allGameModifiers.length === 0) {
        return <div className={styles.allModifiers}>No modifiers active</div>;
    }

    return (
        <div className={styles.overallContainer}>
            <div className={styles.allModifiers}>Current modifiers</div>
            <div>
                {allGameModifiers.map(({ accordingResolution, modifier }) => (
                    <div key={modifier.fromActiveResolutionRid}>
                        <GameModifier gameModifier={modifier.modifier} />
                        <div className={styles.description}>
                            From {accordingResolution?.resolutionDetails.title} (
                            {accordingResolution?.createdOn !== undefined
                                ? getFakeDate(accordingResolution?.createdOn)
                                : "Unknown"}
                            )
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

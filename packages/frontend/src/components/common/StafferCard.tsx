/**
 * Copyright (c) 2022 - KM
 */

import { Card } from "@chakra-ui/react";
import { DEFAULT_STAFFER, IActiveStaffer } from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { getStafferCategory } from "../../utility/categorizeStaffers";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import styles from "./StafferCard.module.scss";

export const StafferCard: React.FC<{ staffer: IActiveStaffer }> = ({ staffer }) => {
    const stafferCategory = getStafferCategory(staffer.stafferDetails);

    return (
        <Card
            className={classNames(styles.stafferCard, {
                [styles.voting]: stafferCategory === "voting",
                [styles.generator]: stafferCategory === "generator",
                [styles.support]: stafferCategory === "support",
            })}
        >
            <div className={styles.name}>{staffer.stafferDetails.displayName}</div>
            <div className={styles.description}>{descriptionOfStaffer[staffer.stafferDetails.type]}</div>
            <div className={styles.footer}>{DEFAULT_STAFFER[staffer.stafferDetails.type].displayName}</div>
        </Card>
    );
};

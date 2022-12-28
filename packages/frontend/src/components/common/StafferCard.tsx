/**
 * Copyright (c) 2022 - KM
 */

import { Card } from "@chakra-ui/react";
import { IActiveStaffer, IPossibleStaffer } from "@pc2/api";
import classNames from "classnames";
import { capitalize } from "lodash-es";
import * as React from "react";
import { getStafferCategory } from "../../utility/categorizeStaffers";
import styles from "./StafferCard.module.scss";

type IDescriptionOfStaffer = {
    [key in IPossibleStaffer["type"]]: string;
};

const descriptionOfStaffer: IDescriptionOfStaffer = {
    intern: "Something something intern",
    representative: "Provides 1 vote on resolutions",
    seniorRepresentative: "Provides 2 votes on resolutions",
    phoneBanker: "Generates 0.5 political capital every day.",
    recruiter: "Adds 1 staffer to your party at a time.",
    partTimeInstructor: "Trains 1 staffer in your party at a time.",
};

const optionalTypeOverride: Partial<IDescriptionOfStaffer> = {
    seniorRepresentative: "Senior representative",
    partTimeInstructor: "Part time instructor",
};

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
            <div className={styles.footer}>
                {optionalTypeOverride[staffer.stafferDetails.type] ?? capitalize(staffer.stafferDetails.type)}
            </div>
        </Card>
    );
};

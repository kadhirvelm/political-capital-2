/**
 * Copyright (c) 2022 - KM
 */

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import styles from "./PreviousResolutions.module.scss";
import { Resolution } from "./Resolution";

export const PreviousResolutions: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const maybeResolutions = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState?.activeResolutions);
    if (maybeResolutions === undefined) {
        return null;
    }

    const resolutionsSorted = maybeResolutions.slice().sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));

    return (
        <div>
            <Button className={styles.backButton} leftIcon={<ArrowBackIcon />} onClick={onBack}>
                Back
            </Button>
            <div className={styles.resolutionsContainer}>
                {resolutionsSorted.map((resolution) => (
                    <Resolution resolution={resolution} />
                ))}
            </div>
        </div>
    );
};

/**
 * Copyright (c) 2022 - KM
 */

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import styles from "./PreviousResolutions.module.scss";
import { Resolution } from "./Resolution";
import { FC } from "react";

export const PreviousResolutions: FC<{ onBack: () => void }> = ({ onBack }) => {
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
                    <Resolution resolution={resolution} key={resolution.activeResolutionRid} />
                ))}
            </div>
        </div>
    );
};

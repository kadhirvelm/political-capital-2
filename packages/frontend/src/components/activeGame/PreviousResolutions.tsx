/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolution } from "@pc2/api";
import * as React from "react";
import { Resolution } from "./Resolution";
import styles from "./PreviousResolutions.module.scss";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

export const PreviousResolutions: React.FC<{ resolutionsSorted: IActiveResolution[]; onBack: () => void }> = ({
    resolutionsSorted,
    onBack,
}) => {
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

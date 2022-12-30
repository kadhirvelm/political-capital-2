/**
 * Copyright (c) 2022 - KM
 */

import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { DEFAULT_STAFFER, IActiveStaffer, IBasicStaffer, IRecruit, isRecruit, isTrainer, ITrainer } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import styles from "./ActivateStaffer.module.scss";
import { RecruiterActivation } from "./RecruiterActivation";
import { TrainerActivation } from "./TrainerActivation";

export const ActivateStaffer: React.FC<{ activateStaffer: IActiveStaffer; onBack: () => void }> = ({
    activateStaffer,
    onBack,
}) => {
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

    if (player === undefined || fullGameState === undefined || resolveEvents === undefined) {
        return null;
    }

    const renderStafferActivationSpecifics = () => {
        if (isRecruit(activateStaffer)) {
            return (
                <RecruiterActivation
                    recruiter={activateStaffer.stafferDetails as IBasicStaffer & IRecruit}
                    recruitRequest={{
                        gameStateRid: fullGameState.gameState.gameStateRid,
                        playerRid: player.playerRid,
                        recruiterRid: activateStaffer.activeStafferRid,
                    }}
                    resolveGameEvents={
                        resolveEvents.players[player.playerRid]?.staffers[activateStaffer.activeStafferRid] ?? []
                    }
                />
            );
        }

        if (isTrainer(activateStaffer)) {
            return (
                <TrainerActivation
                    trainer={activateStaffer.stafferDetails as IBasicStaffer & ITrainer}
                    trainerRequest={{
                        gameStateRid: fullGameState.gameState.gameStateRid,
                        playerRid: player.playerRid,
                        trainerRid: activateStaffer.activeStafferRid,
                    }}
                    resolveGameEvents={
                        resolveEvents.players[player.playerRid]?.staffers[activateStaffer.activeStafferRid] ?? []
                    }
                />
            );
        }

        return undefined;
    };

    return (
        <div className={styles.activateStaffer}>
            <div className={styles.onBack}>
                <Button leftIcon={<ChevronLeftIcon />} onClick={onBack}>
                    Back
                </Button>
            </div>
            <div className={styles.activateLine}>
                Activating {activateStaffer.stafferDetails.displayName} (
                {DEFAULT_STAFFER[activateStaffer.stafferDetails.type].displayName})
            </div>
            <div className={styles.description}>{descriptionOfStaffer[activateStaffer.stafferDetails.type]}</div>
            {renderStafferActivationSpecifics()}
        </div>
    );
};

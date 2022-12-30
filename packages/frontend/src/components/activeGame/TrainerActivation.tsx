/**
 * Copyright (c) 2022 - KM
 */

import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
    DEFAULT_STAFFER,
    IActiveStafferRid,
    IBasicStaffer,
    IEvent,
    IGameStateRid,
    IPlayerRid,
    IStartTrainingStaffer,
    ITrainer,
    StafferLadderIndex,
} from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { IUserFacingResolveEvents } from "../../store/gameState";
import { getStafferCategory } from "../../utility/categorizeStaffers";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { ResolveEvent } from "./ResolveEvent";
import styles from "./TrainerActivation.module.scss";

export const TrainerActivation: React.FC<{
    trainerRequest: { gameStateRid: IGameStateRid; playerRid: IPlayerRid; trainerRid: IActiveStafferRid };
    trainer: IBasicStaffer & ITrainer;
    resolveGameEvents: IUserFacingResolveEvents[];
}> = ({ trainer, trainerRequest, resolveGameEvents }) => {
    const [upgradeStafferToLevel, setUpgradeStafferToLevel] = React.useState<
        { activeStafferRid: IActiveStafferRid; toLevel: IStartTrainingStaffer["toLevel"] } | undefined
    >(undefined);

    console.log({ upgradeStafferToLevel });

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    if (fullGameState === undefined) {
        return null;
    }

    const currentlyTraining = resolveGameEvents.filter(
        (gameEvent) =>
            (gameEvent.state === "active" || gameEvent.state === "pending") &&
            (IEvent.isStartTrainingStaffer(gameEvent.eventDetails) ||
                IEvent.isFinishTrainingStaffer(gameEvent.eventDetails)),
    );

    const maybeRenderCurrentlyTraining = () => {
        if (currentlyTraining.length === 0) {
            return undefined;
        }

        return (
            <div className={styles.currentlyTraining}>
                <div className={styles.currentlyTrainingText}>Currently in progress</div>
                <div className={styles.trainingEvents}>
                    {currentlyTraining.map((trainingEvent) => (
                        <ResolveEvent event={trainingEvent} key={trainingEvent.eventDetails.type} />
                    ))}
                </div>
            </div>
        );
    };

    const upgradeStafferCurried =
        (activeStafferRid: IActiveStafferRid, toLevel: IStartTrainingStaffer["toLevel"]) => () =>
            setUpgradeStafferToLevel({ activeStafferRid, toLevel });

    const maybeRenderTrainStaffer = () => {
        if (currentlyTraining.length >= trainer.trainingCapacity) {
            return (
                <div className={classNames(styles.atCapacity, styles.description)}>
                    This trainer is at capacity. Please wait for the above events to finish.
                </div>
            );
        }

        const availableToTrain = fullGameState.activePlayersStaffers[trainerRequest.playerRid].filter((staffer) => {
            const isNotSelf = staffer.activeStafferRid !== trainerRequest.trainerRid;
            const isNotBusy =
                (fullGameState.resolveEvents.players[trainerRequest.playerRid]?.staffers[
                    staffer.activeStafferRid
                ]?.filter((event) => event.state !== "active")?.length ?? 0) === 0;
            const hasUpgrades = (StafferLadderIndex[staffer.stafferDetails.type] ?? []).length > 0;

            return isNotSelf && isNotBusy && hasUpgrades && staffer.state === "active";
        });

        return (
            <div className={styles.train}>
                <div className={styles.trainStaffer}>Available staffers to train</div>
                <div className={styles.allTrainingPossibilities}>
                    {availableToTrain.map((staffer) => {
                        const upgradesInto = StafferLadderIndex[staffer.stafferDetails.type] ?? [];
                        const stafferCategory = getStafferCategory(staffer);

                        return (
                            <div className={styles.singleTrainee} key={staffer.activeStafferRid}>
                                <div
                                    className={classNames(styles.currentPosition, {
                                        [styles.voting]: stafferCategory === "voting",
                                        [styles.generator]: stafferCategory === "generator",
                                        [styles.support]: stafferCategory === "support",
                                    })}
                                >
                                    <div>{staffer.stafferDetails.displayName}</div>
                                    <div>{DEFAULT_STAFFER[staffer.stafferDetails.type].displayName}</div>
                                    <div className={styles.description}>
                                        {descriptionOfStaffer[staffer.stafferDetails.type]}
                                    </div>
                                </div>
                                <div className={styles.upgradeInto}>
                                    {upgradesInto.map((upgradeStaffer) => {
                                        const defaultStaffer = DEFAULT_STAFFER[upgradeStaffer];
                                        const newStafferCategory = getStafferCategory(defaultStaffer);

                                        return (
                                            <div className={styles.withArrow} key={upgradeStaffer}>
                                                <ArrowForwardIcon className={styles.arrow} />
                                                <div
                                                    className={classNames(styles.newPosition, {
                                                        [styles.voting]: newStafferCategory === "voting",
                                                        [styles.generator]: newStafferCategory === "generator",
                                                        [styles.support]: newStafferCategory === "support",
                                                    })}
                                                    onClick={upgradeStafferCurried(
                                                        staffer.activeStafferRid,
                                                        upgradeStaffer,
                                                    )}
                                                >
                                                    <div>
                                                        {defaultStaffer.displayName} ({defaultStaffer.costToAcquire} PC,{" "}
                                                        {defaultStaffer.timeToAcquire} days)
                                                    </div>
                                                    <div className={styles.description}>
                                                        {descriptionOfStaffer[upgradeStaffer]}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div>
            {maybeRenderCurrentlyTraining()}
            {maybeRenderTrainStaffer()}
        </div>
    );
};

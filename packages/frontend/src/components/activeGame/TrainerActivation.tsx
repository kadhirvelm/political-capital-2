/**
 * Copyright (c) 2022 - KM
 */

import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
} from "@chakra-ui/react";
import {
    DEFAULT_STAFFER,
    IActiveStaffer,
    IActiveStafferRid,
    IBasicStaffer,
    IEvent,
    IGameStateRid,
    IPlayerRid,
    IStartTrainingStaffer,
    ITrainer,
    PoliticalCapitalTwoServiceFrontend,
    StafferLadderIndex,
} from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { batch } from "react-redux";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { addGameEventToStaffer, IUserFacingResolveEvents } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { getStafferCategory } from "../../utility/categorizeStaffers";
import { roundToHundred } from "../../utility/roundTo";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { ResolveEvent } from "./ResolveEvent";
import styles from "./TrainerActivation.module.scss";

export const TrainerActivation: React.FC<{
    trainerRequest: { gameStateRid: IGameStateRid; playerRid: IPlayerRid; trainerRid: IActiveStafferRid };
    trainer: IBasicStaffer & ITrainer;
    resolveGameEvents: IUserFacingResolveEvents[];
}> = ({ trainer, trainerRequest, resolveGameEvents }) => {
    const toast = useToast();
    const dispatch = usePoliticalCapitalDispatch();

    const [isLoading, setIsLoading] = React.useState(false);
    const [upgradeStafferToLevel, setUpgradeStafferToLevel] = React.useState<
        { activeStaffer: IActiveStaffer; toLevel: IStartTrainingStaffer["toLevel"] } | undefined
    >(undefined);

    const closeModal = () => setUpgradeStafferToLevel(undefined);

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

    if (fullGameState === undefined || resolveEvents === undefined) {
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
                    {currentlyTraining.map((trainingEvent, index) => (
                        <ResolveEvent event={trainingEvent} key={trainingEvent.eventDetails.type + index.toString()} />
                    ))}
                </div>
            </div>
        );
    };

    const upgradeStafferCurried = (activeStaffer: IActiveStaffer, toLevel: IStartTrainingStaffer["toLevel"]) => () =>
        setUpgradeStafferToLevel({ activeStaffer, toLevel });

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
                (resolveEvents.players[trainerRequest.playerRid]?.staffers[staffer.activeStafferRid]?.filter(
                    (event) => event.state === "active" || event.state === "pending",
                )?.length ?? 0) === 0;
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
                                        {descriptionOfStaffer(resolvedGameModifiers)[staffer.stafferDetails.type]}
                                    </div>
                                </div>
                                <div className={styles.upgradeInto}>
                                    {upgradesInto.map((upgradeStaffer) => {
                                        const defaultStaffer = DEFAULT_STAFFER[upgradeStaffer];
                                        const newStafferCategory = getStafferCategory(defaultStaffer);

                                        const finalCost = roundToHundred(
                                            defaultStaffer.costToAcquire *
                                                resolvedGameModifiers.staffers[upgradeStaffer].costToAcquire,
                                        );
                                        const finalTime = Math.round(
                                            defaultStaffer.timeToAcquire *
                                                resolvedGameModifiers.staffers[upgradeStaffer].timeToAcquire,
                                        );

                                        const isDisabled =
                                            resolvedGameModifiers.staffers[upgradeStaffer].disableTraining;

                                        return (
                                            <div className={styles.withArrow} key={upgradeStaffer}>
                                                <ArrowForwardIcon className={styles.arrow} />
                                                <div
                                                    className={classNames(styles.newPosition, {
                                                        [styles.disabled]: isDisabled,
                                                        [styles.voting]: newStafferCategory === "voting" && !isDisabled,
                                                        [styles.generator]:
                                                            newStafferCategory === "generator" && !isDisabled,
                                                        [styles.support]:
                                                            newStafferCategory === "support" && !isDisabled,
                                                    })}
                                                    onClick={
                                                        isDisabled
                                                            ? undefined
                                                            : upgradeStafferCurried(staffer, upgradeStaffer)
                                                    }
                                                >
                                                    <div>
                                                        {defaultStaffer.displayName} ({finalCost} PC, {finalTime} days)
                                                    </div>
                                                    <div className={styles.description}>
                                                        {descriptionOfStaffer(resolvedGameModifiers)[upgradeStaffer]}
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

    const maybeRenderTrainStafferBody = () => {
        if (upgradeStafferToLevel === undefined) {
            return undefined;
        }

        const toLevelStaffer = DEFAULT_STAFFER[upgradeStafferToLevel.toLevel];

        const finalCost = roundToHundred(
            toLevelStaffer.costToAcquire * resolvedGameModifiers.staffers[toLevelStaffer.type].costToAcquire,
        );
        const finalTime = Math.round(
            toLevelStaffer.timeToAcquire * resolvedGameModifiers.staffers[toLevelStaffer.type].timeToAcquire,
        );

        return (
            <div className={styles.modalSentence}>
                <div className={styles.description}>Confirm asking</div>
                <div>{trainer.displayName}</div>
                <div className={styles.description}>to train</div>
                <div>{upgradeStafferToLevel.activeStaffer.stafferDetails.displayName}</div>
                <div className={styles.description}>
                    from {DEFAULT_STAFFER[upgradeStafferToLevel.activeStaffer.stafferDetails.type].displayName}
                </div>
                <div>to {toLevelStaffer.displayName}</div>
                <div className={styles.description}>costing</div>
                <div>{finalCost} political capital</div>
                <div className={styles.description}>and </div>
                <div>{finalTime} days to complete.</div>
            </div>
        );
    };

    const onConfirmTrainStaffer = async () => {
        if (upgradeStafferToLevel === undefined) {
            return;
        }

        setIsLoading(true);
        const newTrainStaffer = checkIsError(
            await PoliticalCapitalTwoServiceFrontend.trainStaffer({
                gameStateRid: trainerRequest.gameStateRid,
                trainRequest: {
                    playerRid: trainerRequest.playerRid,
                    trainerRid: trainerRequest.trainerRid,
                    activeStafferRid: upgradeStafferToLevel.activeStaffer.activeStafferRid,
                    toLevel: upgradeStafferToLevel.toLevel,
                },
            }),
            toast,
        );
        setIsLoading(false);

        if (newTrainStaffer === undefined) {
            return;
        }

        batch(() => {
            dispatch(
                addGameEventToStaffer({
                    activeStafferRid: trainerRequest.trainerRid,
                    playerRid: trainerRequest.playerRid,
                    resolveGameEvent: newTrainStaffer.pendingEvent,
                }),
            );
            dispatch(
                addGameEventToStaffer({
                    activeStafferRid: upgradeStafferToLevel.activeStaffer.activeStafferRid,
                    playerRid: trainerRequest.playerRid,
                    resolveGameEvent: newTrainStaffer.pendingEvent,
                }),
            );
        });

        closeModal();
    };

    return (
        <div>
            {maybeRenderCurrentlyTraining()}
            {maybeRenderTrainStaffer()}
            <Modal isOpen={upgradeStafferToLevel !== undefined} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm training</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{maybeRenderTrainStafferBody()}</ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="green"
                            disabled={fullGameState.gameState.state !== "active"}
                            isLoading={isLoading}
                            onClick={onConfirmTrainStaffer}
                        >
                            Train staffer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

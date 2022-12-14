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
    getStafferCategory,
    IActiveStaffer,
    IActiveStafferRid,
    IBasicStaffer,
    IEvent,
    IGameClock,
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
import { getAvailableToTrainStaffer } from "../../selectors/staffers";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { addGameEventToStaffer, IUserFacingResolveEvents } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { doesExceedLimit } from "../../utility/doesExceedLimit";
import { roundToHundred } from "../../utility/roundTo";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { getFakeDate } from "../common/ServerStatus";
import { StafferName } from "../common/StafferName";
import { ResolveEvent } from "./ResolveEvent";
import styles from "./TrainerActivation.module.scss";

export const TrainerActivation: React.FC<{
    trainerRequest: { gameStateRid: IGameStateRid; playerRid: IPlayerRid; trainerRid: IActiveStafferRid };
    trainer: IBasicStaffer & ITrainer;
    resolveGameEvents: IUserFacingResolveEvents[];
}> = ({ trainer, trainerRequest, resolveGameEvents }) => {
    const toast = useToast();
    const dispatch = usePoliticalCapitalDispatch();

    const currentPoliticalCapital = usePoliticalCapitalSelector(
        (s) => s.localGameState.fullGameState?.activePlayers[trainerRequest.playerRid]?.politicalCapital ?? 0,
    );
    const currentDate = usePoliticalCapitalSelector(
        (s) => s.localGameState.fullGameState?.gameState.gameClock ?? (0 as IGameClock),
    );

    const [isLoading, setIsLoading] = React.useState(false);
    const [upgradeStafferToLevel, setUpgradeStafferToLevel] = React.useState<
        { activeStaffer: IActiveStaffer; toLevel: IStartTrainingStaffer["toLevel"] } | undefined
    >(undefined);

    const closeModal = () => setUpgradeStafferToLevel(undefined);

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);
    const availableToTrain = usePoliticalCapitalSelector(getAvailableToTrainStaffer(trainerRequest.trainerRid));

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

    const maybeRenderStaffersToTrain = () => {
        if (availableToTrain.length === 0) {
            return <div className={styles.noTraineesAvailable}>No staffers available</div>;
        }

        return availableToTrain.map((staffer) => {
            const upgradesInto = StafferLadderIndex[staffer.stafferDetails.type] ?? [];
            const stafferCategory = getStafferCategory(staffer);

            return (
                <div className={styles.singleTrainee} key={staffer.activeStafferRid}>
                    <div
                        className={classNames(styles.currentPosition, {
                            [styles.voter]: stafferCategory === "voter",
                            [styles.generator]: stafferCategory === "generator",
                            [styles.trainer]: stafferCategory === "trainer",
                            [styles.recruit]: stafferCategory === "recruit",
                            [styles.shadowGovernment]: stafferCategory === "shadowGovernment",
                        })}
                    >
                        <div className={styles.nameContainer}>
                            <StafferName staffer={staffer} showType={true} />
                        </div>
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
                                resolvedGameModifiers.staffers[upgradeStaffer].disableTraining ||
                                doesExceedLimit(upgradeStaffer, trainerRequest.playerRid, fullGameState, "training");

                            const maybeRenderDisabledExplanation = () => {
                                if (!isDisabled) {
                                    return undefined;
                                }

                                if (resolvedGameModifiers.staffers[upgradeStaffer].disableHiring) {
                                    return (
                                        <div className={styles.disabledReason}>
                                            A game modifier has prevented this staffer from being hired.
                                        </div>
                                    );
                                }

                                return (
                                    <div className={styles.disabledReason}>
                                        You have reached the limit for this type of staffer in your party. Staffers
                                        allowed: {DEFAULT_STAFFER[upgradeStaffer].limitPerParty}
                                    </div>
                                );
                            };

                            return (
                                <div className={styles.withArrow} key={upgradeStaffer}>
                                    <ArrowForwardIcon className={styles.arrow} boxSize="1.7em" />
                                    <div
                                        className={classNames(styles.newPosition, {
                                            [styles.disabled]: isDisabled,
                                            [styles.voter]: newStafferCategory === "voter" && !isDisabled,
                                            [styles.generator]: newStafferCategory === "generator" && !isDisabled,
                                            [styles.trainer]: newStafferCategory === "trainer" && !isDisabled,
                                            [styles.recruit]: newStafferCategory === "recruit" && !isDisabled,
                                            [styles.shadowGovernment]:
                                                newStafferCategory === "shadowGovernment" && !isDisabled,
                                        })}
                                        onClick={
                                            isDisabled ? undefined : upgradeStafferCurried(staffer, upgradeStaffer)
                                        }
                                    >
                                        <div>
                                            {defaultStaffer.displayName} ({finalCost} PC, {finalTime} days)
                                        </div>
                                        <div className={styles.description}>
                                            {descriptionOfStaffer(resolvedGameModifiers)[upgradeStaffer]}
                                        </div>
                                        {maybeRenderDisabledExplanation()}
                                        {defaultStaffer.limitPerParty !== undefined && (
                                            <div className={styles.description}>
                                                Limited to {defaultStaffer.limitPerParty} per party{" "}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
    };

    const maybeRenderTrainStaffer = () => {
        if (currentlyTraining.length >= trainer.trainingCapacity) {
            return (
                <div className={classNames(styles.atCapacity, styles.description)}>
                    This trainer is at capacity. Please wait for the above events to finish.
                </div>
            );
        }

        return (
            <div className={styles.train}>
                <div className={styles.trainStaffer}>Available staffers to train</div>
                <div className={styles.allTrainingPossibilities}>{maybeRenderStaffersToTrain()}</div>
            </div>
        );
    };

    const politicalCapitalCost = (() => {
        if (upgradeStafferToLevel === undefined) {
            return undefined;
        }

        const toLevelStaffer = DEFAULT_STAFFER[upgradeStafferToLevel.toLevel];
        return roundToHundred(
            toLevelStaffer.costToAcquire * resolvedGameModifiers.staffers[toLevelStaffer.type].costToAcquire,
        );
    })();

    const maybeRenderTrainStafferBody = () => {
        if (upgradeStafferToLevel === undefined || politicalCapitalCost === undefined) {
            return undefined;
        }

        const toLevelStaffer = DEFAULT_STAFFER[upgradeStafferToLevel.toLevel];

        const finalTime = Math.round(
            toLevelStaffer.timeToAcquire * resolvedGameModifiers.staffers[toLevelStaffer.type].timeToAcquire,
        );
        const finalPoliticalCapital = roundToHundred(currentPoliticalCapital - politicalCapitalCost);

        return (
            <div className={styles.modalBody}>
                <div className={styles.modalSentence}>
                    <div>{trainer.displayName}</div>
                    <div className={styles.description}>to train</div>
                    <div>{upgradeStafferToLevel.activeStaffer.stafferDetails.displayName}</div>
                </div>
                <div className={styles.modalSentence}>
                    <div className={styles.description}>from</div>
                    <div>{DEFAULT_STAFFER[upgradeStafferToLevel.activeStaffer.stafferDetails.type].displayName}</div>
                    <div className={styles.description}>to</div>
                    <div>{toLevelStaffer.displayName}</div>
                </div>
                <div className={styles.modalSentence}>
                    <div className={styles.description}>Costs</div>
                    <div className={styles.cost}>{politicalCapitalCost} political capital</div>
                    <div className={styles.description}>and </div>
                    <div>{finalTime} days to finish</div>
                </div>
                <div className={styles.result}>
                    <div className={styles.modalSentence}>
                        <div className={styles.description}>Remaining</div>
                        <div>{finalPoliticalCapital} political capital</div>
                    </div>
                    <div className={styles.modalSentence}>
                        <div className={styles.description}>Available on</div>
                        <div>{getFakeDate((currentDate + finalTime) as IGameClock)}</div>
                    </div>
                </div>
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

    const canAfford = (() => {
        if (politicalCapitalCost === undefined) {
            return false;
        }

        return currentPoliticalCapital - politicalCapitalCost >= 0;
    })();

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
                            disabled={fullGameState.gameState.state !== "active" || !canAfford}
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

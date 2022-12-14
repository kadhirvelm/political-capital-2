/**
 * Copyright (c) 2022 - KM
 */

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
    IActiveStafferRid,
    IBasicStaffer,
    IEvent,
    IGameClock,
    IGameStateRid,
    IPlayerRid,
    IPossibleStaffer,
    IRecruit,
    PoliticalCapitalTwoServiceFrontend,
} from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { batch } from "react-redux";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { addGameEventToStaffer, IUserFacingResolveEvents, payPoliticalCapital } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { getTrainsIntoDisplayName } from "../../utility/categorizeStaffers";
import { doesExceedLimit } from "../../utility/doesExceedLimit";
import { roundToHundred } from "../../utility/roundTo";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { getFakeDate } from "../common/ServerStatus";
import styles from "./RecruiterActivation.module.scss";
import { ResolveEvent } from "./ResolveEvent";

export const RecruiterActivation: React.FC<{
    recruitRequest: { gameStateRid: IGameStateRid; playerRid: IPlayerRid; recruiterRid: IActiveStafferRid };
    recruiter: IBasicStaffer & IRecruit;
    resolveGameEvents: IUserFacingResolveEvents[];
}> = ({ recruitRequest, recruiter, resolveGameEvents }) => {
    const toast = useToast();
    const dispatch = usePoliticalCapitalDispatch();

    const currentPoliticalCapital = usePoliticalCapitalSelector(
        (s) => s.localGameState.fullGameState?.activePlayers[recruitRequest.playerRid]?.politicalCapital ?? 0,
    );
    const currentDate = usePoliticalCapitalSelector(
        (s) => s.localGameState.fullGameState?.gameState.gameClock ?? (0 as IGameClock),
    );

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);
    const isPaused = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState?.gameState.state !== "active");

    const [isLoading, setIsLoading] = React.useState(false);
    const [confirmStaffer, setConfirmStaffer] = React.useState<IPossibleStaffer | undefined>(undefined);

    if (fullGameState === undefined) {
        return null;
    }

    const closeModal = () => setConfirmStaffer(undefined);
    const openConfirmModal = (staffer: IPossibleStaffer) => () => setConfirmStaffer(staffer);

    const currentlyRecruiting = resolveGameEvents.filter(
        (gameEvent) =>
            (gameEvent.state === "active" || gameEvent.state === "pending") &&
            (IEvent.isStartHireStaffer(gameEvent.eventDetails) || IEvent.isFinishHiringStaffer(gameEvent.eventDetails)),
    );

    const maybeRenderCurrentlyRecruiting = () => {
        if (currentlyRecruiting.length === 0) {
            return undefined;
        }

        return (
            <div className={styles.currentlyRecruiting}>
                <div className={styles.currentlyHiring}>Currently in progress</div>
                <div className={styles.hiringEvents}>
                    {currentlyRecruiting.map((recruitingEvent, index) => (
                        <ResolveEvent
                            event={recruitingEvent}
                            key={recruitingEvent.eventDetails.type + index.toString()}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const maybeRenderRecruitStaffer = () => {
        if (currentlyRecruiting.length >= recruiter.recruitCapacity) {
            return (
                <div className={classNames(styles.atCapacity, styles.description)}>
                    This recruiter is at capacity. Please wait for the above events to finish.
                </div>
            );
        }

        const availableToTrain = Object.values(DEFAULT_STAFFER)
            .filter((staffer) => staffer.upgradedFrom.length === 0)
            .slice()
            .sort((a, b) => a.type.localeCompare(b.type));

        return (
            <div className={styles.recruitOptionsContainer}>
                <div className={styles.jobPosting}>Send out a job posting for</div>
                <div className={styles.allJobPostingsContainer}>
                    {availableToTrain.map((staffer) => {
                        const stafferCategory = getStafferCategory(staffer);
                        const trainsInto = getTrainsIntoDisplayName(staffer);

                        const finalCost = roundToHundred(
                            staffer.costToAcquire * resolvedGameModifiers.staffers[staffer.type].costToAcquire,
                        );
                        const finalTime = Math.round(
                            staffer.timeToAcquire * resolvedGameModifiers.staffers[staffer.type].timeToAcquire,
                        );

                        const isDisabled =
                            resolvedGameModifiers.staffers[staffer.type].disableHiring ||
                            doesExceedLimit(staffer.type, recruitRequest.playerRid, fullGameState, "recruiting");

                        const maybeRenderDisabledExplanation = () => {
                            if (!isDisabled) {
                                return undefined;
                            }

                            if (resolvedGameModifiers.staffers[staffer.type].disableHiring) {
                                return (
                                    <div className={styles.disabledReason}>
                                        A game modifier has prevented this staffer from being hired.
                                    </div>
                                );
                            }

                            return (
                                <div className={styles.disabledReason}>
                                    You have reached the limit for this type of staffer in your party. Staffers allowed:{" "}
                                    {DEFAULT_STAFFER[staffer.type].limitPerParty}
                                </div>
                            );
                        };

                        return (
                            <div
                                className={classNames(styles.singleJobPosting, {
                                    [styles.disabled]: isDisabled,
                                    [styles.voter]: stafferCategory === "voter" && !isDisabled,
                                    [styles.generator]: stafferCategory === "generator" && !isDisabled,
                                    [styles.trainer]: stafferCategory === "trainer" && !isDisabled,
                                    [styles.recruit]: stafferCategory === "recruit" && !isDisabled,
                                    [styles.shadowGovernment]: stafferCategory === "shadowGovernment" && !isDisabled,
                                })}
                                key={staffer.type}
                                onClick={isDisabled ? undefined : openConfirmModal(staffer)}
                            >
                                <div>
                                    {staffer.displayName} ({finalCost} PC, {finalTime} days)
                                </div>
                                <div className={styles.description}>
                                    {descriptionOfStaffer(resolvedGameModifiers)[staffer.type]}
                                </div>
                                <div className={styles.trainsInto}>
                                    <div className={styles.description}>Trains into</div>
                                    {trainsInto.map((type, index) => (
                                        <span key={type}>
                                            {type}
                                            {index !== trainsInto.length - 1 && ","}
                                        </span>
                                    ))}
                                </div>
                                {maybeRenderDisabledExplanation()}
                                {staffer.limitPerParty !== undefined && (
                                    <div className={styles.description}>
                                        Limited to {staffer.limitPerParty} per party{" "}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const politicalCapitalCost = (() => {
        if (confirmStaffer === undefined) {
            return undefined;
        }

        return roundToHundred(
            confirmStaffer.costToAcquire * resolvedGameModifiers.staffers[confirmStaffer.type].costToAcquire,
        );
    })();

    const maybeRenderJobPostingBody = () => {
        if (confirmStaffer === undefined || politicalCapitalCost === undefined) {
            return undefined;
        }

        const finalTime = Math.round(
            confirmStaffer.timeToAcquire * resolvedGameModifiers.staffers[confirmStaffer.type].timeToAcquire,
        ) as IGameClock;
        const finalPoliticalCapital = roundToHundred(currentPoliticalCapital - politicalCapitalCost);

        return (
            <div className={styles.modalBody}>
                <div className={styles.modalSentence}>
                    <div>{recruiter.displayName}</div>
                    <div className={styles.description}>to hire</div>
                    <div>{confirmStaffer.displayName}</div>
                </div>
                <div className={styles.modalSentence}>
                    <div className={styles.description}>Costs</div>
                    <div className={styles.cost}>{politicalCapitalCost} political capital</div>
                    <div className={styles.description}>and</div>
                    <div>{finalTime} days to hire</div>
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

    const onConfirmSendingOutJobPosting = async () => {
        if (confirmStaffer === undefined) {
            return;
        }

        setIsLoading(true);
        const newRecruitStaffer = checkIsError(
            await PoliticalCapitalTwoServiceFrontend.recruitStaffer({
                gameStateRid: recruitRequest.gameStateRid,
                recruitRequest: {
                    playerRid: recruitRequest.playerRid,
                    recruiterRid: recruitRequest.recruiterRid,
                    stafferType: confirmStaffer.type,
                },
            }),
            toast,
        );
        setIsLoading(false);

        if (newRecruitStaffer === undefined) {
            return undefined;
        }

        const subtractPoliticalCapital =
            confirmStaffer.costToAcquire * resolvedGameModifiers.staffers[confirmStaffer.type].costToAcquire;

        batch(() => {
            dispatch(payPoliticalCapital({ cost: subtractPoliticalCapital, playerRid: recruitRequest.playerRid }));

            dispatch(
                addGameEventToStaffer({
                    activeStafferRid: recruitRequest.recruiterRid,
                    playerRid: recruitRequest.playerRid,
                    resolveGameEvent: newRecruitStaffer.pendingEvent,
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
            {maybeRenderCurrentlyRecruiting()}
            {maybeRenderRecruitStaffer()}
            <Modal isOpen={confirmStaffer !== undefined} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm job posting</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{maybeRenderJobPostingBody()}</ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="green"
                            disabled={isPaused || !canAfford}
                            isLoading={isLoading}
                            onClick={onConfirmSendingOutJobPosting}
                        >
                            Send out job posting
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

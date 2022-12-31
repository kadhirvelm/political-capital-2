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
    IActiveStafferRid,
    IBasicStaffer,
    IEvent,
    IGameStateRid,
    IPlayerRid,
    IPossibleStaffer,
    IRecruit,
    PoliticalCapitalTwoServiceFrontend,
} from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { addGameEventToStaffer, IUserFacingResolveEvents } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { getStafferCategory, getTrainsIntoDisplayName } from "../../utility/categorizeStaffers";
import { roundToHundred } from "../../utility/roundTo";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import styles from "./RecruiterActivation.module.scss";
import { ResolveEvent } from "./ResolveEvent";

export const RecruiterActivation: React.FC<{
    recruitRequest: { gameStateRid: IGameStateRid; playerRid: IPlayerRid; recruiterRid: IActiveStafferRid };
    recruiter: IBasicStaffer & IRecruit;
    resolveGameEvents: IUserFacingResolveEvents[];
}> = ({ recruitRequest, recruiter, resolveGameEvents }) => {
    const toast = useToast();
    const dispatch = usePoliticalCapitalDispatch();

    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);
    const isPaused = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState?.gameState.state !== "active");

    const [isLoading, setIsLoading] = React.useState(false);
    const [confirmStaffer, setConfirmStaffer] = React.useState<IPossibleStaffer | undefined>(undefined);

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
            <div className={styles.recruit}>
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

                        const isDisabled = resolvedGameModifiers.staffers[staffer.type].disableHiring;

                        return (
                            <div
                                className={classNames(styles.singleJobPosting, {
                                    [styles.disabled]: isDisabled,
                                    [styles.voting]: stafferCategory === "voting" && !isDisabled,
                                    [styles.generator]: stafferCategory === "generator" && !isDisabled,
                                    [styles.support]: stafferCategory === "support" && !isDisabled,
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
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const maybeRenderJobPostingBody = () => {
        if (confirmStaffer === undefined) {
            return undefined;
        }

        const finalCost = roundToHundred(
            confirmStaffer.costToAcquire * resolvedGameModifiers.staffers[confirmStaffer.type].costToAcquire,
        );
        const finalTime = Math.round(
            confirmStaffer.timeToAcquire * resolvedGameModifiers.staffers[confirmStaffer.type].timeToAcquire,
        );

        return (
            <div className={styles.modalSentence}>
                <div className={styles.description}>Confirm asking</div>
                <div>{recruiter.displayName}</div>
                <div className={styles.description}>to send out a job posting for a</div>
                <div>{confirmStaffer.displayName}</div>
                <div className={styles.description}>costing</div>
                <div>{finalCost} political capital</div>
                <div className={styles.description}>and </div>
                <div>{finalTime} days to hire.</div>
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

        dispatch(
            addGameEventToStaffer({
                activeStafferRid: recruitRequest.recruiterRid,
                playerRid: recruitRequest.playerRid,
                resolveGameEvent: newRecruitStaffer.pendingEvent,
            }),
        );
        closeModal();
    };

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
                            disabled={isPaused}
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

/**
 * Copyright (c) 2023 - KM
 */

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
} from "@chakra-ui/react";
import { NotificationServiceFrontend } from "@pc2/api";
import { INotification } from "@pc2/api/dist/types/INotification";
import { noop } from "lodash-es";
import * as React from "react";
import { useDispatch } from "react-redux";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { markNotificationAsRead } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { getFakeDate } from "../common/ServerStatus";
import { AnonymousAvatar, PCAvatar, PlayerName } from "../common/StafferName";
import styles from "./NotificationsModal.module.scss";

export const NotificationsModal: React.FC<{}> = () => {
    const toast = useToast();
    const dispatch = useDispatch();

    const viewingNotifications = usePoliticalCapitalSelector((s) => s.localGameState.viewingNotifications);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const [isLoading, setIsLoading] = React.useState(false);

    if (fullGameState === undefined) {
        return null;
    }

    const maybeTopNotification = viewingNotifications[0];

    const renderTopNotification = () => {
        if (maybeTopNotification === undefined) {
            return undefined;
        }

        return INotification.visit(maybeTopNotification.notificationDetails, {
            anonymous: (anonymous) => (
                <div className={styles.messageContainer}>
                    <div className={styles.avatarContainer}>
                        <AnonymousAvatar />
                    </div>
                    <div className={styles.messageDetailsContainer}>
                        <div className={styles.nameAndMessage}>
                            <div>Unknown - </div>
                            <div>{anonymous.message}</div>
                        </div>
                        <div className={styles.date}>Sent on {getFakeDate(maybeTopNotification.createdOn)}</div>
                    </div>
                </div>
            ),
            betweenPlayers: (betweenPlayers) => {
                const accordingPlayer = fullGameState.players[betweenPlayers.fromPlayer];
                const accordingActivePlayer = fullGameState.activePlayers[betweenPlayers.fromPlayer];
                return (
                    <div className={styles.messageContainer}>
                        <div className={styles.avatarContainer}>
                            <PlayerName player={accordingPlayer} activePlayer={accordingActivePlayer} />
                        </div>
                        <div className={styles.messageDetailsContainer}>
                            <div className={styles.nameAndMessage}>
                                <div>{accordingPlayer.name} - </div>
                                <div>{betweenPlayers.message}</div>
                            </div>
                            <div className={styles.date}>Sent on {getFakeDate(maybeTopNotification.createdOn)}</div>
                        </div>
                    </div>
                );
            },
            game: (game) => (
                <div className={styles.messageContainer}>
                    <div className={styles.avatarContainer}>
                        <PCAvatar />
                    </div>
                    <div className={styles.messageDetailsContainer}>
                        <div className={styles.nameAndMessage}>
                            <div>Game message - </div>
                            <div>{game.message}</div>
                        </div>
                        <div className={styles.date}>Sent on {getFakeDate(maybeTopNotification.createdOn)}</div>
                    </div>
                </div>
            ),
            unknown: () => <div>Unknown message</div>,
        });
    };

    const markTopMessageAsRead = async () => {
        if (maybeTopNotification === undefined) {
            return;
        }

        setIsLoading(true);
        const updatedNotification = checkIsError(
            await NotificationServiceFrontend.markNotificationAsRead({
                notificationRid: maybeTopNotification.notificationRid,
            }),
            toast,
        );
        setIsLoading(false);

        if (updatedNotification === undefined) {
            return;
        }

        dispatch(markNotificationAsRead(updatedNotification));
    };

    return (
        <Modal isOpen={maybeTopNotification !== undefined} onClose={noop}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Received messages</ModalHeader>
                <ModalBody>{renderTopNotification()}</ModalBody>
                <ModalFooter>
                    {viewingNotifications.length > 1 && (
                        <div className={styles.totalNotifications}>(1 / {viewingNotifications.length})</div>
                    )}
                    <Button
                        colorScheme="green"
                        disabled={maybeTopNotification === undefined}
                        isLoading={isLoading}
                        onClick={markTopMessageAsRead}
                    >
                        Mark as read
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

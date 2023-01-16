/**
 * Copyright (c) 2023 - KM
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
import { IActiveNotificationRid, INotification, IPlayerRid, NotificationServiceFrontend } from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { v4 } from "uuid";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { checkIsError } from "../../utility/alertOnError";
import { getFakeDate } from "../common/ServerStatus";
import { AnonymousAvatar, PCAvatar, PlayerName } from "../common/StafferName";
import styles from "./Messages.module.scss";

const MESSAGES_TO_SEND = ["How will you vote?", "Can we meet?", "Yes", "No", "Not sure yet"];

const SendMessages: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const toast = useToast();

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const [toPlayerRid, setToPlayerRid] = React.useState<IPlayerRid | undefined>(undefined);
    const [message, setMessage] = React.useState<string | undefined>(undefined);

    const [isLoading, setIsLoading] = React.useState(false);

    if (player === undefined || fullGameState === undefined) {
        return null;
    }

    const setPlayerCurried = (playerRid: IPlayerRid) => () => setToPlayerRid(playerRid);

    const renderPlayerSelector = () => {
        return (
            <div className={styles.playerSelectorContainer}>
                {Object.values(fullGameState.players).map((otherPlayer) => {
                    if (otherPlayer.playerRid === player.playerRid) {
                        return undefined;
                    }

                    return (
                        <div
                            className={classNames(styles.singlePlayer, {
                                [styles.selected]: toPlayerRid === otherPlayer.playerRid,
                            })}
                            key={otherPlayer.playerRid}
                            onClick={setPlayerCurried(otherPlayer.playerRid)}
                        >
                            <PlayerName
                                player={otherPlayer}
                                activePlayer={fullGameState.activePlayers[otherPlayer.playerRid]}
                            />
                            <div className={styles.playerName}>{otherPlayer.name}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const setMessageCurried = (sendMessage: string) => () => setMessage(sendMessage);

    const maybeRenderSelectMessage = () => {
        if (toPlayerRid === undefined) {
            return undefined;
        }

        return (
            <div className={styles.messagesContainer}>
                <div className={styles.availableTemplates}>Available message templates</div>
                <div className={styles.messageTemplates}>
                    {MESSAGES_TO_SEND.map((sendMessage) => (
                        <div
                            className={classNames(styles.singleMessage, { [styles.selected]: sendMessage === message })}
                            key={sendMessage}
                            onClick={setMessageCurried(sendMessage)}
                        >
                            {sendMessage}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const sendMessage = async () => {
        if (toPlayerRid === undefined || message === undefined) {
            return;
        }

        setIsLoading(true);
        checkIsError(
            await NotificationServiceFrontend.createNewNotification({
                activeNotificationRid: v4() as IActiveNotificationRid,
                gameStateRid: fullGameState.gameState.gameStateRid,
                notificationDetails: {
                    fromPlayer: player.playerRid,
                    message,
                    type: "between-players",
                },
                toPlayerRid: toPlayerRid,
                createdOn: fullGameState.gameState.gameClock,
                status: "unread",
            }),
            toast,
        );
        setIsLoading(false);

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Send message</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {renderPlayerSelector()}
                    {maybeRenderSelectMessage()}
                </ModalBody>
                <ModalFooter>
                    <Button className={styles.cancelButton}>Cancel</Button>
                    <Button
                        colorScheme="green"
                        disabled={
                            toPlayerRid === undefined ||
                            message === undefined ||
                            fullGameState.gameState.state !== "active"
                        }
                        isLoading={isLoading}
                        onClick={sendMessage}
                    >
                        Send message
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const Messages: React.FC<{}> = () => {
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const allNotifications = usePoliticalCapitalSelector((s) => s.localGameState.notifications);

    const [isNewMessageOpen, setIsNewMessageOpen] = React.useState(false);

    if (fullGameState === undefined) {
        return null;
    }

    const closeSendMessages = () => setIsNewMessageOpen(false);
    const onOpenSendMessages = () => setIsNewMessageOpen(true);

    const gameMessages = allNotifications
        .filter((n) => INotification.isGame(n.notificationDetails))
        .sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));
    const playerMessages = allNotifications
        .filter(
            (n) =>
                INotification.isBetweenPlayers(n.notificationDetails) ||
                INotification.isAnonymous(n.notificationDetails),
        )
        .sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));

    const maybeRenderMessages = (messages: React.ReactNode[]) => {
        if (messages.length === 0) {
            return <div className={styles.description}>No messages</div>;
        }

        return messages;
    };

    return (
        <div className={styles.viewMessagesContainer}>
            <div className={styles.sendNewMessage}>
                <Button colorScheme="green" onClick={onOpenSendMessages} style={{ display: "flex", flex: "1" }}>
                    Send new message
                </Button>
            </div>
            <div className={styles.messageCategory}>
                <div className={styles.messageCategoryTitle}>Game messages ({gameMessages.length})</div>
                <div className={styles.messageCategoryContainer}>
                    {maybeRenderMessages(
                        gameMessages.map((gameMessage) => {
                            if (INotification.isGame(gameMessage.notificationDetails)) {
                                return (
                                    <div className={styles.singleMessage} key={gameMessage.activeNotificationRid}>
                                        <div>
                                            <PCAvatar sizeOverride="lg" />
                                        </div>
                                        <div className={styles.messageDetails}>
                                            <div className={styles.nameAndMessage}>
                                                {gameMessage.notificationDetails.message}
                                            </div>
                                            <div className={styles.description}>
                                                Sent on {getFakeDate(gameMessage.createdOn)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return <div>Unknown game message</div>;
                        }),
                    )}
                </div>
            </div>
            <div className={styles.messageCategory}>
                <div className={styles.messageCategoryTitle}>Player messages ({playerMessages.length})</div>
                <div className={styles.messageCategoryContainer}>
                    {maybeRenderMessages(
                        playerMessages.map((playerMessage) => {
                            if (INotification.isAnonymous(playerMessage.notificationDetails)) {
                                return (
                                    <div className={styles.singleMessage} key={playerMessage.activeNotificationRid}>
                                        <div>
                                            <AnonymousAvatar sizeOverride="lg" />
                                        </div>
                                        <div className={styles.messageDetails}>
                                            <div className={styles.nameAndMessage}>
                                                <div className={styles.description}>Anonymous</div>
                                                <div>{playerMessage.notificationDetails.message}</div>
                                            </div>
                                            <div className={styles.description}>
                                                Sent on {getFakeDate(playerMessage.createdOn)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            if (INotification.isBetweenPlayers(playerMessage.notificationDetails)) {
                                const accordingPlayer =
                                    fullGameState.players[playerMessage.notificationDetails.fromPlayer];
                                const accordingActivePlayer =
                                    fullGameState.activePlayers[playerMessage.notificationDetails.fromPlayer];

                                return (
                                    <div className={styles.singleMessage} key={playerMessage.activeNotificationRid}>
                                        <div>
                                            <PlayerName
                                                player={accordingPlayer}
                                                activePlayer={accordingActivePlayer}
                                                sizeOverride="lg"
                                            />
                                        </div>
                                        <div className={styles.messageDetails}>
                                            <div className={styles.nameAndMessage}>
                                                <div>{accordingPlayer.name}</div>
                                                <div>{playerMessage.notificationDetails.message}</div>
                                            </div>
                                            <div className={styles.description}>
                                                Sent on {getFakeDate(playerMessage.createdOn)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return <div className={styles.singleMessage}>Unknown player message</div>;
                        }),
                    )}
                </div>
            </div>
            <SendMessages
                isOpen={isNewMessageOpen}
                key={isNewMessageOpen ? "open" : "closed"}
                onClose={closeSendMessages}
            />
        </div>
    );
};

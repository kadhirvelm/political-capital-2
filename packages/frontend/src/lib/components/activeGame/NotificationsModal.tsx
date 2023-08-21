/*
 * Copyright 2023 KM.
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
import { INotification, NotificationServiceFrontend } from "@pc2/api";
import { noop } from "lodash-es";
import { useDispatch } from "react-redux";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { markNotificationAsRead } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { getFakeDate } from "../common/ServerStatus";
import { AnonymousAvatar, PCAvatar, PlayerName } from "../common/StafferName";
import styles from "./NotificationsModal.module.scss";
import { type FC, useState } from "react";

export const NotificationsModal: FC<{}> = () => {
  const toast = useToast();
  const dispatch = useDispatch();

  const viewingNotifications = usePoliticalCapitalSelector((s) => s.localGameState.viewingNotifications);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

  const [isLoading, setIsLoading] = useState(false);

  if (fullGameState === undefined) {
    return null;
  }

  const maybeTopNotification = viewingNotifications[0];

  const renderTopNotification = () => {
    if (maybeTopNotification === undefined) {
      return;
    }

    return INotification.visit(maybeTopNotification.notificationDetails, {
      anonymous: (anonymous) => (
        <div className={styles.messageContainer}>
          <div className={styles.avatarContainer}>
            <AnonymousAvatar />
          </div>
          <div className={styles.messageDetailsContainer}>
            <div className={styles.messageSenderAndText}>
              <div className={styles.description}>Unknown</div>
              <div className={styles.messageText}>{anonymous.message}</div>
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
              <PlayerName activePlayer={accordingActivePlayer} player={accordingPlayer} />
            </div>
            <div className={styles.messageDetailsContainer}>
              <div className={styles.messageSenderAndText}>
                <div>{accordingPlayer.name}</div>
                <div className={styles.messageText}>{betweenPlayers.message}</div>
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
            <div className={styles.messageSenderAndText}>
              <div className={styles.description}>Game message</div>
              <div className={styles.messageText}>{game.message}</div>
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
        activeNotificationRid: maybeTopNotification.activeNotificationRid,
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

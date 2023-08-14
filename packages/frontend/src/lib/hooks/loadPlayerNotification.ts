/**
 * Copyright (c) 2023 - KM
 */

import { useToast } from "@chakra-ui/react";
import { NotificationServiceFrontend } from "@pc2/api";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../store/createStore";
import { setNotifications, setViewingNotifications } from "../store/gameState";
import { checkIsError } from "../utility/alertOnError";
import { useEffect } from "react";

export function useLoadPlayerNotifications() {
    const toast = useToast();
    const dispatch = usePoliticalCapitalDispatch();

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const notifications = usePoliticalCapitalSelector((s) => s.localGameState.notifications);

    const loadPlayerNotifications = async () => {
        if (player?.playerRid === undefined) {
            return;
        }

        const maybeNotifications = checkIsError(
            await NotificationServiceFrontend.getAllNotifications({ playerRid: player.playerRid }),
            toast,
        );
        if (maybeNotifications === undefined) {
            return;
        }

        dispatch(setNotifications(maybeNotifications));
    };

    useEffect(() => {
        loadPlayerNotifications();
    }, [player?.playerRid]);

    const viewUnreadNotification = () => {
        const unreadNotifications = notifications.filter((n) => n.status === "unread");
        if (unreadNotifications.length === 0) {
            return;
        }

        dispatch(setViewingNotifications(unreadNotifications));
    };

    useEffect(() => {
        viewUnreadNotification();
    }, [notifications]);
}

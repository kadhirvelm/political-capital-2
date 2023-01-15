/**
 * Copyright (c) 2023 - KM
 */

import { INotificationService } from "@pc2/api";
import { Notification } from "@pc2/distributed-compute";
import { sendMessageToPlayer } from "./socketService";

export async function createNewNotification(
    payload: INotificationService["createNewNotification"]["payload"],
): Promise<INotificationService["createNewNotification"]["response"]> {
    const newlyCreatedNotification = await Notification.create({ ...payload, status: "unread" });

    sendMessageToPlayer(newlyCreatedNotification.toPlayerRid, {
        type: "new-notification",
        notification: newlyCreatedNotification,
    });

    return {};
}

export async function getAllNotifications(
    payload: INotificationService["getAllNotifications"]["payload"],
): Promise<INotificationService["getAllNotifications"]["response"]> {
    const allNotificationsForPlayer = await Notification.findAll({ where: { toPlayerRid: payload.playerRid } });
    return allNotificationsForPlayer;
}

export async function markNotificationAsRead(
    payload: INotificationService["markNotificationAsRead"]["payload"],
): Promise<INotificationService["markNotificationAsRead"]["response"]> {
    const updatedNotification = await Notification.update(
        { status: "read" },
        { where: { notificationRid: payload.notificationRid }, returning: true },
    );

    return updatedNotification[1][0];
}

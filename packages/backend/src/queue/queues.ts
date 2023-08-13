/**
 * Copyright (c) 2022 - KM
 */

import { IActiveNotification, IGameClock, IGameStateRid, IPlayerRid, IPossibleNotification } from "@pc2/api";
import queue from "bull";

const connection = {
    redis: { port: 6379, host: process.env.DATABASE_HOST ?? "localhost" },
};

export interface IProcessPlayerQueue {
    gameStateRid: IGameStateRid;
    playerRid: IPlayerRid;
    gameClock: IGameClock;
}
export const ProcessPlayerQueue = new queue<IProcessPlayerQueue>("process-player-queue", connection);

export interface IUpdatePlayerQueue {
    gameStateRid: IGameStateRid;
    gameClock: IGameClock;
}
export const UpdatePlayerQueue = new queue<IUpdatePlayerQueue>("update-player-queue", connection);

export interface ISendNotificationToPlayer {
    gameStateRid: IGameStateRid;
    playerRid: IPlayerRid;
    notificationDetails: IPossibleNotification;
    status?: IActiveNotification["status"];
    createdOn: IGameClock;
}
export const SendNotificationToPlayerQueue = new queue<ISendNotificationToPlayer>(
    "send-notification-to-player",
    connection,
);

/**
 * Copyright (c) 2023 - KM
 */

import { IActiveNotificationRid, INotificationService } from "@pc2/api";
import { DoneCallback, Job } from "bull";
import { v4 } from "uuid";
import { createNewNotification } from "../services/notificationService";
import { ISendNotificationToPlayer } from "./queues";

export async function sendNotificationToPlayer(job: Job<ISendNotificationToPlayer>, done: DoneCallback) {
    const fullAssembledRequest: INotificationService["createNewNotification"]["payload"] = {
        createdOn: job.data.createdOn,
        gameStateRid: job.data.gameStateRid,
        notificationDetails: job.data.notificationDetails,
        activeNotificationRid: v4() as IActiveNotificationRid,
        status: job.data.status ?? "unread",
        toPlayerRid: job.data.playerRid,
    };

    await createNewNotification(fullAssembledRequest);

    done();
}

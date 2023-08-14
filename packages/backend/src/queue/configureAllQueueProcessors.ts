/**
 * Copyright (c) 2022 - KM
 */

import { BullAdapter, createBullBoard, ExpressAdapter } from "@bull-board/express";
import { Express } from "express";
import { sendNotificationToPlayer } from "./sendNotificationToPlayer";
import { handleUpdatePlayerProcessor } from "./updatePlayer";
import { handlePlayerProcessor } from "../playerQueue/processPlayerQueue";
import { ProcessPlayerQueue, UpdatePlayerQueue, SendNotificationToPlayerQueue } from "./queues";

function setupPlayerQueueProcessor() {
    ProcessPlayerQueue.process(3, handlePlayerProcessor);
    UpdatePlayerQueue.process(1, handleUpdatePlayerProcessor);
    SendNotificationToPlayerQueue.process(1, sendNotificationToPlayer);
}

export function configureAllQueueProcessors(app: Express) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/queues");

    createBullBoard({
        queues: [new BullAdapter(ProcessPlayerQueue), new BullAdapter(UpdatePlayerQueue)],
        serverAdapter,
    });

    app.use("/queues", serverAdapter.getRouter());

    setupPlayerQueueProcessor();
}

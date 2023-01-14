/**
 * Copyright (c) 2022 - KM
 */

import { BullAdapter, createBullBoard, ExpressAdapter } from "@bull-board/express";
import { handlePlayerProcessor, ProcessPlayerQueue, UpdatePlayerQueue } from "@pc2/distributed-compute";
import { Express } from "express";
import { handleUpdatePlayerProcessor } from "./updatePlayer";

function setupPlayerQueueProcessor() {
    ProcessPlayerQueue.process(3, handlePlayerProcessor);
    UpdatePlayerQueue.process(3, handleUpdatePlayerProcessor);
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

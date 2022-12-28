/**
 * Copyright (c) 2022 - KM
 */

import { ProcessPlayerQueue, handlePlayerProcessor, UpdatePlayerQueue } from "@pc2/distributed-compute";
import { handleUpdatePlayerProcessor } from "./updatePlayer";

function setupPlayerQueueProcessor() {
    ProcessPlayerQueue.process(2, handlePlayerProcessor);
    UpdatePlayerQueue.process(2, handleUpdatePlayerProcessor);
}

export function configureAllQueueProcessors() {
    setupPlayerQueueProcessor();
}

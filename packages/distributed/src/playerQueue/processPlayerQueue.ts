/**
 * Copyright (c) 2022 - KM
 */

import { Job, DoneCallback } from "bull";
import { IProcessPlayerQueue, UpdatePlayerQueue } from "../queues";

export function handlePlayerProcessor(job: Job<IProcessPlayerQueue>, done: DoneCallback) {
    // TODO: handle processing a player's updates

    UpdatePlayerQueue.add({ gameStateRid: job.data.gameStateRid, playerRid: job.data.playerRid });

    done();
}

/**
 * Copyright (c) 2022 - KM
 */

import { IUpdatePlayerQueue } from "@pc2/distributed-compute";
import { Job, DoneCallback } from "bull";
import { getGameState } from "../services/gameService";
import { sendMessageToPlayer } from "../services/socketService";

export async function handleUpdatePlayerProcessor(job: Job<IUpdatePlayerQueue>, done: DoneCallback) {
    const currentGameState = await getGameState(job.data);
    if (currentGameState === undefined) {
        done();
        return;
    }

    sendMessageToPlayer(job.data.playerRid, { newGameState: currentGameState, type: "update-game-state" });
    done();
}

/**
 * Copyright (c) 2022 - KM
 */

import { ActivePlayer, IUpdatePlayerQueue } from "@pc2/distributed-compute";
import { Job, DoneCallback } from "bull";
import { getGameState } from "../services/gameService";
import { sendMessageToPlayer } from "../services/socketService";

export async function handleUpdatePlayerProcessor(job: Job<IUpdatePlayerQueue>, done: DoneCallback) {
    const totalPlayersUpdate = await ActivePlayer.findAll({ where: { gameStateRid: job.data.gameStateRid } });
    const updatedPlayers = totalPlayersUpdate.filter((u) => u.lastUpdatedGameClock === job.data.gameClock);

    if (updatedPlayers.length !== totalPlayersUpdate.length) {
        done();
        return;
    }

    const currentGameState = await getGameState(job.data);
    if (currentGameState === undefined) {
        done();
        return;
    }

    totalPlayersUpdate.forEach((player) => {
        sendMessageToPlayer(player.playerRid, { newGameState: currentGameState, type: "update-game-state" });
    });

    done();
}

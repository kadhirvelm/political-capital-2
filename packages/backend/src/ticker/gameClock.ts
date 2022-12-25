/**
 * Copyright (c) 2022 - KM
 */

import { IGameClock } from "@pc2/api";
import { ActivePlayer, GameState, ProcessPlayerQueue } from "@pc2/distributed-compute";
import cron from "node-cron";
import { resolveGameEvents } from "./resolveGameEvents";

export async function updateGameStates() {
    const activeGames = await GameState.findAll({ where: { state: "active" } });

    activeGames.forEach(async (activeGame) => {
        activeGame.gameClock = (activeGame.gameClock + 1) as IGameClock;
        if (activeGame.gameClock === 365) {
            activeGame.state = "complete";
        }

        await activeGame.save();

        await resolveGameEvents(activeGame);

        const activePlayers = await ActivePlayer.findAll({ where: { gameStateRid: activeGame.gameStateRid } });
        activePlayers.forEach((activePlayer) => {
            ProcessPlayerQueue.add({
                gameStateRid: activeGame.gameStateRid,
                playerRid: activePlayer.playerRid,
            });
        });
    });
}

export function startGameClockTicker() {
    // Ticks every 10 seconds
    cron.schedule("*/10 * * * * *", () => {
        updateGameStates();
    });
}

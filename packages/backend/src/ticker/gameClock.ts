/**
 * Copyright (c) 2022 - KM
 */

import { IGameClock, TOTAL_DAYS_IN_GAME } from "@pc2/api";
import cron from "node-cron";
import { sendGameStateToAllActiveGlobalScreens } from "../services/gameService";
import { resolveGameEvents } from "./resolveGameEvents";
import { takeGameSnapshot } from "./takeGameSnapshot";
import { GameState, ActivePlayer } from "../models";
import { ProcessPlayerQueue } from "../queue/queues";

async function handleEndGame(activeGame: GameState) {
    activeGame.state = "complete";
    await activeGame.save();

    await takeGameSnapshot(activeGame);

    sendGameStateToAllActiveGlobalScreens(activeGame.gameStateRid);
}

export async function updateGameStates() {
    const activeGames = await GameState.findAll({ where: { state: "active" } });

    activeGames.forEach(async (activeGame) => {
        activeGame.gameClock = (activeGame.gameClock + 1) as IGameClock;

        if (activeGame.gameClock > TOTAL_DAYS_IN_GAME) {
            await handleEndGame(activeGame);
            return;
        }

        await Promise.all([activeGame.save(), resolveGameEvents(activeGame)]);
        sendGameStateToAllActiveGlobalScreens(activeGame.gameStateRid);

        const [activePlayers] = await Promise.all([
            ActivePlayer.findAll({ where: { gameStateRid: activeGame.gameStateRid } }),
            takeGameSnapshot(activeGame),
        ]);

        activePlayers.forEach((activePlayer) => {
            ProcessPlayerQueue.add({
                gameStateRid: activeGame.gameStateRid,
                playerRid: activePlayer.playerRid,
                gameClock: activeGame.gameClock,
            });
        });
    });
}

export function startGameClockTicker() {
    // Ticks every 5 seconds
    cron.schedule("*/5 * * * * *", () => {
        updateGameStates();
    });
}

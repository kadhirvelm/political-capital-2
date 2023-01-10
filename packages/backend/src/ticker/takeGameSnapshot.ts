/**
 * Copyright (c) 2023 - KM
 */

import { IHistoricalGameState } from "@pc2/api";
import { ActivePlayer, GameState, HistoricalGameState } from "@pc2/distributed-compute";

export async function takeGameSnapshot(activeGame: GameState) {
    const allPlayers = await ActivePlayer.findAll({ where: { gameStateRid: activeGame.gameStateRid } });

    const historicalGameState: IHistoricalGameState = {
        gameClock: activeGame.gameClock,
        gameStateRid: activeGame.gameStateRid,
        snapshot: allPlayers.map((p) => ({ playerRid: p.playerRid, politicalCapital: p.politicalCapital })),
    };

    await HistoricalGameState.create(historicalGameState);
}

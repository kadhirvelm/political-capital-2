/**
 * Copyright (c) 2022 - KM
 */

import { IActiveGameService } from "@pc2/api";
import {
    ActivePlayer,
    ActiveResolution,
    ActiveResolutionVote,
    ActiveStaffer,
    GameState,
} from "@pc2/distributed-compute";

export async function getGameState(
    payload: IActiveGameService["getGameState"]["payload"],
): Promise<IActiveGameService["getGameState"]["response"] | undefined> {
    const gameStatePromise = GameState.findOne({ where: { gameStateRid: payload.gameStateRid } });
    const activePlayerPromise = ActivePlayer.findOne({
        where: { playerRid: payload.playerRid, gameStateRid: payload.gameStateRid },
    });
    const activeResolutionPromise = ActiveResolution.findOne({
        where: { gameStateRid: payload.gameStateRid, state: "active" },
    });
    const activePlayerStaffersPromise = ActiveStaffer.findAll({
        where: { gameStateRid: payload.gameStateRid, playerRid: payload.playerRid },
    });

    const [gameState, activePlayer, activeResolution, activePlayerStaffers] = await Promise.all([
        gameStatePromise,
        activePlayerPromise,
        activeResolutionPromise,
        activePlayerStaffersPromise,
    ]);
    if (gameState == null || activePlayer == null || activeResolution == null) {
        // eslint-disable-next-line no-console
        console.error({ gameState, activePlayer, activeResolution });
        throw new Error(
            `Something went wrong when trying to get the game state for: ${payload.gameStateRid} and player ${payload.playerRid}`,
        );
    }

    const activePlayerVotes = await ActiveResolutionVote.findAll({
        where: {
            gameStateRid: payload.gameStateRid,
            activeStafferRid: activePlayerStaffers.map((staffer) => staffer.activeStafferRid),
        },
    });

    return {
        gameState,
        activePlayer,
        activeResolution,
        activePlayerVotes,
        activePlayerStaffers,
    };
}

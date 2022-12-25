/**
 * Copyright (c) 2022 - KM
 */

import { IActiveGameService, IGameClock, IGameStateRid } from "@pc2/api";
import {
    ActivePlayer,
    ActiveResolution,
    ActiveResolutionVote,
    ActiveStaffer,
    GameState,
} from "@pc2/distributed-compute";
import Express from "express";
import { Op } from "sequelize";
import { v4 } from "uuid";
import { INITIAL_APPROVAL_RATING, INITIAL_POLITICAL_CAPITAL } from "../constants/initializePlayers";
import { sendMessageToPlayer } from "./socketService";

export async function getGameState(
    payload: IActiveGameService["getGameState"]["payload"],
): Promise<IActiveGameService["getGameState"]["response"]> {
    const gameStatePromise = GameState.findOne({ where: { gameStateRid: payload.gameStateRid } });
    const activePlayersPromise = ActivePlayer.findAll({
        where: { gameStateRid: payload.gameStateRid },
    });
    const activeResolutionPromise = ActiveResolution.findOne({
        where: { gameStateRid: payload.gameStateRid, state: "active" },
    });
    const activePlayerVotesPromise = ActiveResolutionVote.findAll({
        where: {
            gameStateRid: payload.gameStateRid,
        },
    });
    const activePlayersStaffersPromise = ActiveStaffer.findAll({
        where: { gameStateRid: payload.gameStateRid },
    });

    const [gameState, activePlayers, activeResolution, activePlayersVotes, activePlayersStaffers] = await Promise.all([
        gameStatePromise,
        activePlayersPromise,
        activeResolutionPromise,
        activePlayerVotesPromise,
        activePlayersStaffersPromise,
    ]);
    if (gameState == null) {
        throw new Error(`Something went wrong when trying to get the game state for: ${payload.gameStateRid}.`);
    }

    return {
        gameState,
        activePlayers,
        activeResolution: activeResolution ?? undefined,
        activePlayersVotes,
        activePlayersStaffers,
    };
}

export async function sendGameStateToAllActivePlayers(gameStateRid: IGameStateRid) {
    const gameState = await getGameState({ gameStateRid });

    gameState.activePlayers.forEach((activePlayer) => {
        sendMessageToPlayer(activePlayer.playerRid, { newGameState: gameState, type: "update-game-state" });
    });
}

export async function createNewGame(
    payload: IActiveGameService["createNewGame"]["payload"],
    response: Express.Response,
): Promise<IActiveGameService["createNewGame"]["response"] | undefined> {
    const availableGame = await GameState.findOne({ where: { state: { [Op.not]: ["complete"] } } });
    if (availableGame != null) {
        response
            .status(400)
            .send({ error: `There is already a game in progress, please refresh your page and try again.` });
        return undefined;
    }

    const newGameStateRid = v4() as IGameStateRid;

    await Promise.all([
        GameState.create({ gameStateRid: newGameStateRid, state: "waiting", gameClock: 0 as IGameClock }),
        ActivePlayer.create({
            gameStateRid: newGameStateRid,
            playerRid: payload.playerRid,
            politicalCapital: INITIAL_POLITICAL_CAPITAL,
            approvalRating: INITIAL_APPROVAL_RATING,
            lastUpdatedGameClock: 0 as IGameClock,
            isReady: false,
        }),
    ]);

    await sendGameStateToAllActivePlayers(newGameStateRid);

    return {};
}

export async function joinActiveGame(
    payload: IActiveGameService["joinActiveGame"]["payload"],
): Promise<IActiveGameService["joinActiveGame"]["response"] | undefined> {
    const availableGame = await GameState.findOne({ where: { state: { [Op.not]: ["complete"] } } });
    if (availableGame == null) {
        return undefined;
    }

    const maybeExistingActivePlayer = await ActivePlayer.findOne({
        where: { playerRid: payload.playerRid, gameStateRid: availableGame.gameStateRid },
    });
    if (maybeExistingActivePlayer == null) {
        await ActivePlayer.create({
            gameStateRid: availableGame.gameStateRid,
            playerRid: payload.playerRid,
            politicalCapital: INITIAL_POLITICAL_CAPITAL,
            approvalRating: INITIAL_APPROVAL_RATING,
            lastUpdatedGameClock: availableGame.gameClock,
            isReady: false,
        });
    }

    await sendGameStateToAllActivePlayers(availableGame.gameStateRid);

    return {};
}

export async function readyPlayer(
    payload: IActiveGameService["readyPlayer"]["payload"],
    response: Express.Response,
): Promise<IActiveGameService["readyPlayer"]["response"] | undefined> {
    const maybeActivePlayer = await ActivePlayer.findOne({
        where: { gameStateRid: payload.gameStateRid, playerRid: payload.playerRid },
    });
    if (maybeActivePlayer == null) {
        response.status(400).send({
            error: `Could not find a player with the id: ${payload.playerRid} in game ${payload.gameStateRid}. Try refreshing the page?`,
        });
        return undefined;
    }

    if (!maybeActivePlayer.isReady) {
        maybeActivePlayer.isReady = true;
        await maybeActivePlayer.save();
    }

    await sendGameStateToAllActivePlayers(maybeActivePlayer.gameStateRid);

    return {};
}

export async function changeActiveGameState(
    payload: IActiveGameService["changeActiveGameState"]["payload"],
    response: Express.Response,
): Promise<IActiveGameService["changeActiveGameState"]["response"] | undefined> {
    const maybeActiveGame = await GameState.findOne({ where: { gameStateRid: payload.gameStateRid } });
    if (maybeActiveGame == null) {
        response
            .status(400)
            .send({ error: `Canot find a game with the id: ${payload.gameStateRid}. Try refresing the page?` });
        return undefined;
    }

    const allActivePlayers = await ActivePlayer.findAll({ where: { gameStateRid: maybeActiveGame.gameStateRid } });
    const areAllPlayersReady = allActivePlayers.every((player) => player.isReady);

    if (!areAllPlayersReady) {
        const notReadyPlayers = allActivePlayers.filter((player) => !player.isReady);
        response.status(400).send({
            error: `Cannot change the game state until everyone is ready: ${notReadyPlayers.length} not ready.`,
        });
        return undefined;
    }

    maybeActiveGame.state = payload.newState;
    await maybeActiveGame.save();

    await sendGameStateToAllActivePlayers(maybeActiveGame.gameStateRid);

    return {};
}

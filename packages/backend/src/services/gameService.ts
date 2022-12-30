/**
 * Copyright (c) 2022 - KM
 */

import {
    IActiveGameService,
    IActiveResolutionVote,
    IActiveStaffer,
    IActiveStafferRid,
    IEvent,
    IFullGameState,
    IGameClock,
    IGameStateRid,
    IPlayerRid,
    IResolveGameEvent,
} from "@pc2/api";
import {
    ActivePlayer,
    ActiveResolution,
    ActiveResolutionVote,
    ActiveStaffer,
    GameState,
    getStafferOfType,
    Player,
    ResolveGameEvent,
} from "@pc2/distributed-compute";
import Express from "express";
import _ from "lodash";
import { Op } from "sequelize";
import { v4 } from "uuid";
import { INITIAL_STAFFERS, TIME_BETWEEN_RESOLUTIONS_IN_DAYS } from "../constants/game";
import { INITIAL_APPROVAL_RATING, INITIAL_POLITICAL_CAPITAL } from "../constants/initializePlayers";
import { sendMessageToPlayer } from "./socketService";

// This isn't strictly necessary, but given there's a second promise going out anyway, might as well optimize it
async function indexResolveEvents(resolveEvents: IResolveGameEvent[]): Promise<IFullGameState["resolveEvents"]> {
    return new Promise((resolve) => {
        const indexedResolveEvents: IFullGameState["resolveEvents"] = {
            game: [],
            players: {},
        };

        resolveEvents.forEach((resolveEvent) => {
            IEvent.visit<void>(resolveEvent.eventDetails, {
                finishHiringStaffer: (finishHiringStaffer) => {
                    indexedResolveEvents.players[finishHiringStaffer.playerRid] = indexedResolveEvents.players[
                        finishHiringStaffer.playerRid
                    ] ?? {
                        overall: [],
                        staffers: {},
                    };

                    indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[
                        finishHiringStaffer.activeStafferRid
                    ] =
                        indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[
                            finishHiringStaffer.activeStafferRid
                        ] ?? [];

                    indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[
                        finishHiringStaffer.activeStafferRid
                    ].push(resolveEvent);

                    indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[
                        finishHiringStaffer.recruiterRid
                    ] =
                        indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[
                            finishHiringStaffer.recruiterRid
                        ] ?? [];

                    indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[
                        finishHiringStaffer.recruiterRid
                    ].push(resolveEvent);
                },
                startHiringStaffer: (startHiringStaffer) => {
                    indexedResolveEvents.players[startHiringStaffer.playerRid] = indexedResolveEvents.players[
                        startHiringStaffer.playerRid
                    ] ?? {
                        overall: [],
                        staffers: {},
                    };

                    indexedResolveEvents.players[startHiringStaffer.playerRid].staffers[
                        startHiringStaffer.recruiterRid
                    ] =
                        indexedResolveEvents.players[startHiringStaffer.playerRid].staffers[
                            startHiringStaffer.recruiterRid
                        ] ?? [];
                    indexedResolveEvents.players[startHiringStaffer.playerRid].staffers[
                        startHiringStaffer.recruiterRid
                    ].push(resolveEvent);
                },
                startTrainingStaffer: (startTrainingStaffer) => {
                    indexedResolveEvents.players[startTrainingStaffer.playerRid] = indexedResolveEvents.players[
                        startTrainingStaffer.playerRid
                    ] ?? {
                        overall: [],
                        staffers: {},
                    };

                    indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[
                        startTrainingStaffer.trainerRid
                    ] =
                        indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[
                            startTrainingStaffer.trainerRid
                        ] ?? [];
                    indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[
                        startTrainingStaffer.trainerRid
                    ].push(resolveEvent);

                    indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[
                        startTrainingStaffer.activeStafferRid
                    ] =
                        indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[
                            startTrainingStaffer.activeStafferRid
                        ] ?? [];
                    indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[
                        startTrainingStaffer.activeStafferRid
                    ].push(resolveEvent);
                },
                finishTrainingStaffer: (finishTrainingStaffer) => {
                    indexedResolveEvents.players[finishTrainingStaffer.playerRid] = indexedResolveEvents.players[
                        finishTrainingStaffer.playerRid
                    ] ?? {
                        overall: [],
                        staffers: {},
                    };

                    indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[
                        finishTrainingStaffer.trainerRid
                    ] =
                        indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[
                            finishTrainingStaffer.trainerRid
                        ] ?? [];
                    indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[
                        finishTrainingStaffer.trainerRid
                    ].push(resolveEvent);

                    indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[
                        finishTrainingStaffer.activeStafferRid
                    ] =
                        indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[
                            finishTrainingStaffer.activeStafferRid
                        ] ?? [];
                    indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[
                        finishTrainingStaffer.activeStafferRid
                    ].push(resolveEvent);
                },
                newResolution: () => {
                    indexedResolveEvents.game.push(resolveEvent);
                },
                tallyResolution: () => {
                    indexedResolveEvents.game.push(resolveEvent);
                },
                unknown: () => {},
            });
        });

        resolve(indexedResolveEvents);
    });
}

async function indexVotes(activePlayersVotes: IActiveResolutionVote[]): Promise<IFullGameState["activePlayersVotes"]> {
    return new Promise((resolve) => {
        const indexedActivePlayerVotes: IFullGameState["activePlayersVotes"] = {};

        activePlayersVotes.forEach((activeVote) => {
            indexedActivePlayerVotes[activeVote.activeResolutionRid] =
                indexedActivePlayerVotes[activeVote.activeResolutionRid] ?? {};

            indexedActivePlayerVotes[activeVote.activeResolutionRid][activeVote.activeStafferRid] =
                indexedActivePlayerVotes[activeVote.activeResolutionRid][activeVote.activeStafferRid] ?? [];

            indexedActivePlayerVotes[activeVote.activeResolutionRid][activeVote.activeStafferRid].push(activeVote);
        });

        resolve(indexedActivePlayerVotes);
    });
}

async function indexStaffers(activeStaffers: IActiveStaffer[]): Promise<IFullGameState["activePlayersStaffers"]> {
    return new Promise((resolve) => {
        const indexedStaffers: IFullGameState["activePlayersStaffers"] = {};

        activeStaffers.forEach((staffer) => {
            indexedStaffers[staffer.playerRid] = indexedStaffers[staffer.playerRid] ?? [];

            indexedStaffers[staffer.playerRid].push(staffer);
        });

        resolve(indexedStaffers);
    });
}

export async function getGameState(
    payload: IActiveGameService["getGameState"]["payload"],
): Promise<IActiveGameService["getGameState"]["response"] | undefined> {
    const gameStatePromise = GameState.findOne({ where: { gameStateRid: payload.gameStateRid } });
    const activePlayersPromise = ActivePlayer.findAll({
        where: { gameStateRid: payload.gameStateRid },
    });
    const activeResolutionsPromise = ActiveResolution.findAll({
        where: { gameStateRid: payload.gameStateRid },
    });
    const activePlayerVotesPromise = ActiveResolutionVote.findAll({
        where: {
            gameStateRid: payload.gameStateRid,
        },
    });
    const activePlayersStaffersPromise = ActiveStaffer.findAll({
        where: { gameStateRid: payload.gameStateRid },
    });
    const allResolveEventsPromise = ResolveGameEvent.findAll({
        where: { gameStateRid: payload.gameStateRid },
    });

    const [gameState, activePlayers, activeResolutions, activePlayersVotes, activePlayersStaffers, allResolveEvents] =
        await Promise.all([
            gameStatePromise,
            activePlayersPromise,
            activeResolutionsPromise,
            activePlayerVotesPromise,
            activePlayersStaffersPromise,
            allResolveEventsPromise,
        ]);
    if (gameState == null) {
        // eslint-disable-next-line no-console
        console.error(`Something went wrong when trying to get the game state for: ${payload.gameStateRid}.`);
        return undefined;
    }

    const [players, indexedResolveEvents, indexedStaffers, indexedActivePlayersVotes] = await Promise.all([
        Player.findAll({ where: { playerRid: activePlayers.map((p) => p.playerRid) } }),
        indexResolveEvents(allResolveEvents),
        indexStaffers(activePlayersStaffers),
        indexVotes(activePlayersVotes),
    ]);

    return {
        gameState,
        players: _.keyBy(players, (player) => player.playerRid),
        activePlayers: _.keyBy(activePlayers, (player) => player.playerRid),
        activeResolutions,
        activePlayersVotes: indexedActivePlayersVotes,
        activePlayersStaffers: indexedStaffers,
        resolveEvents: indexedResolveEvents,
    };
}

export async function sendGameStateToAllActivePlayers(gameStateRid: IGameStateRid) {
    const gameState = await getGameState({ gameStateRid });
    if (gameState === undefined) {
        // eslint-disable-next-line no-console
        console.error(`Cannot send an empty game state: ${gameStateRid}.`);
        return;
    }

    Object.values(gameState.activePlayers).forEach((activePlayer) => {
        sendMessageToPlayer(activePlayer.playerRid, { newGameState: gameState, type: "update-game-state" });
    });
}

async function addPlayerToGame(gameStateRid: IGameStateRid, playerRid: IPlayerRid) {
    return Promise.all([
        ActivePlayer.create({
            gameStateRid,
            playerRid,
            politicalCapital: INITIAL_POLITICAL_CAPITAL,
            approvalRating: INITIAL_APPROVAL_RATING,
            lastUpdatedGameClock: 0 as IGameClock,
            isReady: false,
        }),
        ...INITIAL_STAFFERS.map((staffer) =>
            ActiveStaffer.create({
                gameStateRid,
                playerRid,
                activeStafferRid: v4() as IActiveStafferRid,
                stafferDetails: getStafferOfType(staffer),
                state: "active",
            }),
        ),
    ]);
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
        addPlayerToGame(newGameStateRid, payload.playerRid),
        ResolveGameEvent.create({
            gameStateRid: newGameStateRid,
            resolvesOn: TIME_BETWEEN_RESOLUTIONS_IN_DAYS as IGameClock,
            eventDetails: { type: "new-resolution" },
            state: "active",
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
        return {};
    }

    const maybeExistingActivePlayer = await ActivePlayer.findOne({
        where: { playerRid: payload.playerRid, gameStateRid: availableGame.gameStateRid },
    });
    if (maybeExistingActivePlayer == null) {
        await addPlayerToGame(availableGame.gameStateRid, payload.playerRid);
    }

    await sendGameStateToAllActivePlayers(availableGame.gameStateRid);

    return {};
}

export async function changeReadyState(
    payload: IActiveGameService["changeReadyState"]["payload"],
    response: Express.Response,
): Promise<IActiveGameService["changeReadyState"]["response"] | undefined> {
    const maybeActivePlayer = await ActivePlayer.findOne({
        where: { gameStateRid: payload.gameStateRid, playerRid: payload.playerRid },
    });
    if (maybeActivePlayer == null) {
        response.status(400).send({
            error: `Could not find a player with the id: ${payload.playerRid} in game ${payload.gameStateRid}. Try refreshing the page?`,
        });
        return undefined;
    }

    if (maybeActivePlayer.isReady !== payload.isReady) {
        maybeActivePlayer.isReady = payload.isReady;
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

/*
 * Copyright 2023 KM.
 */

import {
  AvatarSet,
  type IActiveGameService,
  type IActiveResolutionVote,
  type IActiveStaffer,
  type IActiveStafferRid,
  IEvent,
  type IFullGameState,
  type IGameClock,
  type IGameStateRid,
  INITIAL_APPROVAL_RATING,
  INITIAL_STAFFERS,
  INITIAL_POLITICAL_CAPITAL,
  type IPlayerRid,
  type IResolveGameEvent,
} from "@pc2/api";
import { type Express } from "express";
import _ from "lodash";
import { Op } from "sequelize";
import { v4 } from "uuid";
import { areThereActiveGlobalScreens, sendMessageToGlobalScreens, sendMessageToPlayer } from "./socketService";
import {
  GameState,
  PassedGameModifier,
  ActivePlayer,
  ActiveResolution,
  ActiveResolutionVote,
  ActiveStaffer,
  ResolveGameEvent,
  Player,
  HistoricalGameState,
} from "../models";
import { getStafferOfType } from "../utils/getStafferOfType";
import { implementBackend } from "../routes/implementService";

// This isn't strictly necessary, but given there's a second promise going out anyway, might as well optimize it
async function indexResolveEvents(resolveEvents: IResolveGameEvent[]): Promise<IFullGameState["resolveEvents"]> {
  return new Promise((resolve) => {
    const indexedResolveEvents: IFullGameState["resolveEvents"] = {
      game: [],
      players: {},
    };

    for (const resolveEvent of resolveEvents) {
      IEvent.visit<void>(resolveEvent.eventDetails, {
        finishHiringStaffer: (finishHiringStaffer) => {
          indexedResolveEvents.players[finishHiringStaffer.playerRid] = indexedResolveEvents.players[
            finishHiringStaffer.playerRid
          ] ?? {
            overall: [],
            staffers: {},
          };

          indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[finishHiringStaffer.activeStafferRid] =
            indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[
              finishHiringStaffer.activeStafferRid
            ] ?? [];

          indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[
            finishHiringStaffer.activeStafferRid
          ].push(resolveEvent);

          indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[finishHiringStaffer.recruiterRid] =
            indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[finishHiringStaffer.recruiterRid] ??
            [];

          indexedResolveEvents.players[finishHiringStaffer.playerRid].staffers[finishHiringStaffer.recruiterRid].push(
            resolveEvent,
          );
        },
        finishTrainingStaffer: (finishTrainingStaffer) => {
          indexedResolveEvents.players[finishTrainingStaffer.playerRid] = indexedResolveEvents.players[
            finishTrainingStaffer.playerRid
          ] ?? {
            overall: [],
            staffers: {},
          };

          indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[finishTrainingStaffer.trainerRid] =
            indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[finishTrainingStaffer.trainerRid] ??
            [];
          indexedResolveEvents.players[finishTrainingStaffer.playerRid].staffers[finishTrainingStaffer.trainerRid].push(
            resolveEvent,
          );

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
        payoutEarlyVoting: (payoutEarlyVoting) => {
          indexedResolveEvents.players[payoutEarlyVoting.playerRid] = indexedResolveEvents.players[
            payoutEarlyVoting.playerRid
          ] ?? { overall: [], staffers: {} };

          indexedResolveEvents.players[payoutEarlyVoting.playerRid].staffers[payoutEarlyVoting.activeStafferRid] =
            indexedResolveEvents.players[payoutEarlyVoting.playerRid].staffers[payoutEarlyVoting.activeStafferRid] ??
            [];
          indexedResolveEvents.players[payoutEarlyVoting.playerRid].staffers[payoutEarlyVoting.activeStafferRid].push(
            resolveEvent,
          );
        },
        startHiringStaffer: (startHiringStaffer) => {
          indexedResolveEvents.players[startHiringStaffer.playerRid] = indexedResolveEvents.players[
            startHiringStaffer.playerRid
          ] ?? {
            overall: [],
            staffers: {},
          };

          indexedResolveEvents.players[startHiringStaffer.playerRid].staffers[startHiringStaffer.recruiterRid] =
            indexedResolveEvents.players[startHiringStaffer.playerRid].staffers[startHiringStaffer.recruiterRid] ?? [];
          indexedResolveEvents.players[startHiringStaffer.playerRid].staffers[startHiringStaffer.recruiterRid].push(
            resolveEvent,
          );
        },
        startTrainingStaffer: (startTrainingStaffer) => {
          indexedResolveEvents.players[startTrainingStaffer.playerRid] = indexedResolveEvents.players[
            startTrainingStaffer.playerRid
          ] ?? {
            overall: [],
            staffers: {},
          };

          indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[startTrainingStaffer.trainerRid] =
            indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[startTrainingStaffer.trainerRid] ??
            [];
          indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[startTrainingStaffer.trainerRid].push(
            resolveEvent,
          );

          indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[startTrainingStaffer.activeStafferRid] =
            indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[
              startTrainingStaffer.activeStafferRid
            ] ?? [];
          indexedResolveEvents.players[startTrainingStaffer.playerRid].staffers[
            startTrainingStaffer.activeStafferRid
          ].push(resolveEvent);
        },
        tallyResolution: () => {
          indexedResolveEvents.game.push(resolveEvent);
        },
        unknown: () => {},
      });
    }

    resolve(indexedResolveEvents);
  });
}

async function indexVotes(activePlayersVotes: IActiveResolutionVote[]): Promise<IFullGameState["activePlayersVotes"]> {
  return new Promise((resolve) => {
    const indexedActivePlayerVotes: IFullGameState["activePlayersVotes"] = {};

    for (const activeVote of activePlayersVotes) {
      indexedActivePlayerVotes[activeVote.activeResolutionRid] =
        indexedActivePlayerVotes[activeVote.activeResolutionRid] ?? {};

      indexedActivePlayerVotes[activeVote.activeResolutionRid][activeVote.activeStafferRid] =
        indexedActivePlayerVotes[activeVote.activeResolutionRid][activeVote.activeStafferRid] ?? [];

      indexedActivePlayerVotes[activeVote.activeResolutionRid][activeVote.activeStafferRid].push(activeVote);
    }

    resolve(indexedActivePlayerVotes);
  });
}

async function indexStaffers(activeStaffers: IActiveStaffer[]): Promise<IFullGameState["activePlayersStaffers"]> {
  return new Promise((resolve) => {
    const indexedStaffers: IFullGameState["activePlayersStaffers"] = {};

    for (const staffer of activeStaffers) {
      indexedStaffers[staffer.playerRid] = indexedStaffers[staffer.playerRid] ?? [];

      indexedStaffers[staffer.playerRid].push(staffer);
    }

    resolve(indexedStaffers);
  });
}

export async function getGameState(
  payload: IActiveGameService["getGameState"]["payload"],
): Promise<IActiveGameService["getGameState"]["response"] | undefined> {
  const gameStatePromise = GameState.findOne({ where: { gameStateRid: payload.gameStateRid } });
  const passedGameModifiersPromise = PassedGameModifier.findAll({ where: { gameStateRid: payload.gameStateRid } });
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

  const [
    gameState,
    passedGameModifiers,
    activePlayers,
    activeResolutions,
    activePlayersVotes,
    activePlayersStaffers,
    allResolveEvents,
  ] = await Promise.all([
    gameStatePromise,
    passedGameModifiersPromise,
    activePlayersPromise,
    activeResolutionsPromise,
    activePlayerVotesPromise,
    activePlayersStaffersPromise,
    allResolveEventsPromise,
  ]);
  if (gameState == undefined) {
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
    activePlayers: _.keyBy(activePlayers, (player) => player.playerRid),
    activePlayersStaffers: indexedStaffers,
    activePlayersVotes: indexedActivePlayersVotes,
    activeResolutions,
    gameState,
    passedGameModifiers,
    players: _.keyBy(players, (player) => player.playerRid),
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

  for (const activePlayer of Object.values(gameState.activePlayers)) {
    sendMessageToPlayer(activePlayer.playerRid, { newGameState: gameState, type: "update-game-state" });
  }
}

export async function sendGameStateToAllActiveGlobalScreens(gameStateRid: IGameStateRid) {
  if (!areThereActiveGlobalScreens()) {
    return;
  }

  const gameState = await getGameState({ gameStateRid });
  if (gameState === undefined) {
    // eslint-disable-next-line no-console
    console.error(`Cannot send an empty game state: ${gameStateRid}.`);
    return;
  }

  sendMessageToGlobalScreens({ newGameState: gameState, type: "update-game-state" });
}

export async function getActiveGameState(): Promise<IActiveGameService["getActiveGameState"]["response"]> {
  const availableGame = await GameState.findOne({ where: { state: { [Op.not]: ["complete"] } } });
  if (availableGame == undefined) {
    return {};
  }

  await sendGameStateToAllActiveGlobalScreens(availableGame.gameStateRid);

  return {};
}

async function addPlayerToGame(gameStateRid: IGameStateRid, playerRid: IPlayerRid, isGameActive: boolean = false) {
  const playersInitialAvatarSet = _.sample(AvatarSet) ?? AvatarSet[0];

  return Promise.all([
    ActivePlayer.create({
      approvalRating: INITIAL_APPROVAL_RATING,
      avatarSet: playersInitialAvatarSet,
      gameStateRid,
      isReady: isGameActive ? true : false,
      lastUpdatedGameClock: 0 as IGameClock,
      playerRid,
      politicalCapital: INITIAL_POLITICAL_CAPITAL,
    }),
    ...INITIAL_STAFFERS.map((staffer) =>
      ActiveStaffer.create({
        activeStafferRid: v4() as IActiveStafferRid,
        avatarSet: playersInitialAvatarSet,
        gameStateRid,
        playerRid,
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
  if (availableGame != undefined) {
    response
      .status(400)
      .send({ error: `There is already a game in progress, please refresh your page and try again.` });
    return undefined;
  }

  const newGameStateRid = v4() as IGameStateRid;

  await Promise.all([
    GameState.create({ gameClock: 0 as IGameClock, gameStateRid: newGameStateRid, state: "waiting" }),
    addPlayerToGame(newGameStateRid, payload.playerRid),
    ResolveGameEvent.create({
      eventDetails: { type: "new-resolution" },
      gameStateRid: newGameStateRid,
      resolvesOn: 1 as IGameClock,
      state: "active",
    }),
  ]);

  sendGameStateToAllActiveGlobalScreens(newGameStateRid);
  await sendGameStateToAllActivePlayers(newGameStateRid);

  return {};
}

export async function joinActiveGame(
  payload: IActiveGameService["joinActiveGame"]["payload"],
): Promise<IActiveGameService["joinActiveGame"]["response"] | undefined> {
  const availableGame = await GameState.findOne({ where: { state: { [Op.not]: ["complete"] } } });
  if (availableGame == undefined) {
    return {};
  }

  const maybeExistingActivePlayer = await ActivePlayer.findOne({
    where: { gameStateRid: availableGame.gameStateRid, playerRid: payload.playerRid },
  });
  if (maybeExistingActivePlayer == undefined) {
    await addPlayerToGame(availableGame.gameStateRid, payload.playerRid, availableGame.state === "active");
  }

  sendGameStateToAllActiveGlobalScreens(availableGame.gameStateRid);
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
  if (maybeActivePlayer == undefined) {
    response.status(400).send({
      error: `Could not find a player with the id: ${payload.playerRid} in game ${payload.gameStateRid}. Try refreshing the page?`,
    });
    return undefined;
  }

  maybeActivePlayer.isReady = payload.isReady;

  if (maybeActivePlayer.avatarSet !== payload.avatarSet) {
    await ActiveStaffer.update(
      { avatarSet: payload.avatarSet },
      { where: { gameStateRid: payload.gameStateRid, playerRid: payload.playerRid } },
    );
  }

  maybeActivePlayer.avatarSet = payload.avatarSet;

  await maybeActivePlayer.save();

  sendGameStateToAllActiveGlobalScreens(maybeActivePlayer.gameStateRid);
  await sendGameStateToAllActivePlayers(maybeActivePlayer.gameStateRid);

  return {};
}

export async function changeActiveGameState(
  payload: IActiveGameService["changeActiveGameState"]["payload"],
  response: Express.Response,
): Promise<IActiveGameService["changeActiveGameState"]["response"] | undefined> {
  const maybeActiveGame = await GameState.findOne({ where: { gameStateRid: payload.gameStateRid } });
  if (maybeActiveGame == undefined) {
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

  sendGameStateToAllActiveGlobalScreens(maybeActiveGame.gameStateRid);
  await sendGameStateToAllActivePlayers(maybeActiveGame.gameStateRid);

  return {};
}

export async function getHistoricalGame(
  payload: IActiveGameService["getHistoricalGame"]["payload"],
): Promise<IActiveGameService["getHistoricalGame"]["response"]> {
  const [allHistoricalGame, activePlayers] = await Promise.all([
    HistoricalGameState.findAll({ where: { gameStateRid: payload.gameStateRid } }),
    ActivePlayer.findAll({ where: { gameStateRid: payload.gameStateRid } }),
  ]);

  const players = await Player.findAll({ where: { playerRid: activePlayers.map((p) => p.playerRid) } });

  return { historicalGame: allHistoricalGame, players };
}

/*
 * Copyright 2023 KM.
 */

import { type IImplementEndpoint, type IService } from "../common/generics";
import {
  type IActiveResolutionRid,
  type IActiveStafferRid,
  type IGameStateRid,
  type IGlobalScreenIdentifier,
  type IPlayerRid,
} from "../types/BrandedIDs";
import {
  type IActivePlayer,
  type IActiveResolution,
  type IActiveResolutionVote,
  type IActiveStaffer,
  type IAvatarSet,
  type IGameState,
  type IHistoricalGameState,
  type IPassedGameModifier,
  type IPlayer,
  type IResolveGameEvent,
} from "../types/politicalCapitalTwo";

export interface IIndexedResolveEvents {
  game: IResolveGameEvent[];
  players: {
    [playerRid: IPlayerRid]: {
      overall: IResolveGameEvent[];
      staffers: {
        [stafferRid: IActiveStafferRid]: IResolveGameEvent[];
      };
    };
  };
}

export interface IFullGameState {
  activePlayers: { [playerRid: IPlayerRid]: IActivePlayer };
  activePlayersStaffers: {
    [playerRid: IPlayerRid]: IActiveStaffer[];
  };
  activePlayersVotes: {
    [activeResolutionRid: IActiveResolutionRid]: { [activeStafferRid: IActiveStafferRid]: IActiveResolutionVote[] };
  };
  activeResolutions: IActiveResolution[];
  gameState: IGameState;
  passedGameModifiers: IPassedGameModifier[];
  players: { [playerRid: IPlayerRid]: IPlayer };
  resolveEvents: IIndexedResolveEvents;
}

export interface IActiveGameService extends IService {
  changeActiveGameState: {
    payload: {
      gameStateRid: IGameStateRid;
      newState: IGameState["state"];
    };
    response: Record<string, never>;
  };
  changeReadyState: {
    payload: {
      avatarSet: IAvatarSet;
      gameStateRid: IGameStateRid;
      isReady: boolean;
      playerRid: IPlayerRid;
    };
    response: Record<string, never>;
  };
  createNewGame: {
    payload: {
      playerRid: IPlayerRid;
    };
    response: Record<string, never>;
  };
  getActiveGameState: {
    payload: {
      globalScreenIdentifier: IGlobalScreenIdentifier;
    };
    response: Record<string, never>;
  };
  getGameState: {
    payload: {
      gameStateRid: IGameStateRid;
    };
    response: IFullGameState;
  };
  getHistoricalGame: {
    payload: {
      gameStateRid: IGameStateRid;
    };
    response: {
      historicalGame: IHistoricalGameState[];
      players: IPlayer[];
    };
  };
  joinActiveGame: {
    payload: {
      playerRid: IPlayerRid;
    };
    response: Record<string, never>;
  };
}

export const ActiveGameService: IImplementEndpoint<IActiveGameService> = {
  changeActiveGameState: {
    method: "post",
    slug: "/game-service/change-active-game-state",
  },
  changeReadyState: {
    method: "post",
    slug: "/game-service/change-ready-state",
  },
  createNewGame: {
    method: "post",
    slug: "/game-service/create-new-game",
  },
  getActiveGameState: {
    method: "post",
    slug: "/game-service/get-active-game-state",
  },
  getGameState: {
    method: "post",
    slug: "/game-service/get-game-state",
  },
  getHistoricalGame: {
    method: "post",
    slug: "/game-service/get-historical-game",
  },
  joinActiveGame: {
    method: "post",
    slug: "/game-service/join-active-game",
  },
};

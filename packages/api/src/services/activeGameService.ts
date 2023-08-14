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
  gameState: IGameState;
  passedGameModifiers: IPassedGameModifier[];
  players: { [playerRid: IPlayerRid]: IPlayer };
  activePlayers: { [playerRid: IPlayerRid]: IActivePlayer };
  activeResolutions: IActiveResolution[];
  activePlayersVotes: {
    [activeResolutionRid: IActiveResolutionRid]: { [activeStafferRid: IActiveStafferRid]: IActiveResolutionVote[] };
  };
  activePlayersStaffers: {
    [playerRid: IPlayerRid]: IActiveStaffer[];
  };
  resolveEvents: IIndexedResolveEvents;
}

export interface IActiveGameService extends IService {
  createNewGame: {
    payload: {
      playerRid: IPlayerRid;
    };
    response: Record<string, never>;
  };
  joinActiveGame: {
    payload: {
      playerRid: IPlayerRid;
    };
    response: Record<string, never>;
  };
  changeReadyState: {
    payload: {
      playerRid: IPlayerRid;
      gameStateRid: IGameStateRid;
      isReady: boolean;
      avatarSet: IAvatarSet;
    };
    response: Record<string, never>;
  };
  changeActiveGameState: {
    payload: {
      gameStateRid: IGameStateRid;
      newState: IGameState["state"];
    };
    response: Record<string, never>;
  };
  getGameState: {
    payload: {
      gameStateRid: IGameStateRid;
    };
    response: IFullGameState;
  };
  getActiveGameState: {
    payload: {
      globalScreenIdentifier: IGlobalScreenIdentifier;
    };
    response: Record<string, never>;
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

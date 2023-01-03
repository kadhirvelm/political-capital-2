/**
 * Copyright (c) 2022 - KM
 */

import { implementEndpoints, IService } from "../common/generics";
import {
    IActiveResolutionRid,
    IActiveStafferRid,
    IGameStateRid,
    IGlobalScreenIdentifier,
    IPlayerRid,
} from "../types/BrandedIDs";
import {
    IActivePlayer,
    IActiveResolution,
    IActiveResolutionVote,
    IActiveStaffer,
    IGameState,
    IPassedGameModifier,
    IPlayer,
    IResolveGameEvent,
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
        response: {};
    };
    joinActiveGame: {
        payload: {
            playerRid: IPlayerRid;
        };
        response: {};
    };
    changeReadyState: {
        payload: {
            playerRid: IPlayerRid;
            gameStateRid: IGameStateRid;
            isReady: boolean;
        };
        response: {};
    };
    changeActiveGameState: {
        payload: {
            gameStateRid: IGameStateRid;
            newState: IGameState["state"];
        };
        response: {};
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
        response: {};
    };
}

const { backend, frontend } = implementEndpoints<IActiveGameService>({
    createNewGame: {
        slug: "/game-service/create-new-game",
        method: "post",
    },
    joinActiveGame: {
        slug: "/game-service/join-active-game",
        method: "post",
    },
    changeReadyState: {
        slug: "/game-service/change-ready-state",
        method: "post",
    },
    changeActiveGameState: {
        slug: "/game-service/change-active-game-state",
        method: "post",
    },
    getGameState: {
        slug: "/game-service/get-game-state",
        method: "post",
    },
    getActiveGameState: {
        slug: "/game-service/get-active-game-state",
        method: "post",
    },
});

export const ActiveGameBackend = backend;
export const ActiveGameFrontend = frontend;

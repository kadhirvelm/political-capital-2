/**
 * Copyright (c) 2022 - KM
 */

import { implementEndpoints, IService } from "../common/generics";
import { IGameStateRid, IPlayerRid } from "../types/BrandedIDs";
import {
    IActivePlayer,
    IActiveResolution,
    IActiveResolutionVote,
    IActiveStaffer,
    IGameState,
    IPlayer,
} from "../types/politicalCapitalTwo";

export interface IFullGameState {
    gameState: IGameState;
    players: IPlayer[];
    activePlayers: IActivePlayer[];
    activeResolution?: IActiveResolution;
    activePlayersVotes: IActiveResolutionVote[];
    activePlayersStaffers: IActiveStaffer[];
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
});

export const ActiveGameBackend = backend;
export const ActiveGameFrontend = frontend;

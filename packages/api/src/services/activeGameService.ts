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
} from "../types/politicalCapitalTwo";

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
    readyPlayer: {
        payload: {
            playerRid: IPlayerRid;
            gameStateRid: IGameStateRid;
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
        response: {
            gameState: IGameState;
            activePlayers: IActivePlayer[];
            activeResolution: IActiveResolution;
            activePlayersVotes: IActiveResolutionVote[];
            activePlayersStaffers: IActiveStaffer[];
        };
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
    readyPlayer: {
        slug: "/game-service/ready-player",
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
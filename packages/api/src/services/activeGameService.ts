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
    joinActiveGame: {
        payload: {
            playerRid: IPlayerRid;
        };
        response: IActiveGameService["getGameState"]["response"] | undefined;
    };
    createNewGame: {
        payload: {};
        response: IActiveGameService["getGameState"]["response"] | undefined;
    };
    changeActiveGameState: {
        payload: {
            gameStateRid: IGameStateRid;
            newState: IGameState["state"];
        };
        response: IActiveGameService["getGameState"]["response"];
    };
    getGameState: {
        payload: {
            gameStateRid: IGameStateRid;
            playerRid: IPlayerRid;
        };
        response: {
            gameState: IGameState;
            activePlayer: IActivePlayer;
            activeResolution: IActiveResolution;
            activePlayerVotes: IActiveResolutionVote[];
            activePlayerStaffers: IActiveStaffer[];
        };
    };
}

const { backend, frontend } = implementEndpoints<IActiveGameService>({
    joinActiveGame: {
        slug: "/game-service/join-active-game",
        method: "post",
    },
    createNewGame: {
        slug: "/game-service/create-new-game",
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

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
    getGameState: {
        slug: "/game-service/get-game-state",
        method: "post",
    },
});

export const ActiveGameBackend = backend;
export const ActiveGameFrontend = frontend;

/**
 * Copyright (c) 2022 - KM
 */

import { implementEndpoints, IService } from "../common/generics";
import { IPlayer } from "../types/politicalCapitalTwo";

export interface IPlayerService extends IService {
    getPlayer: {
        payload: { browserIdentifier: string };
        response: { player: IPlayer | undefined };
    };
    registerNewPlayer: {
        payload: Omit<IPlayer, "playerRid">;
        response: { player: IPlayer };
    };
    updatePlayer: {
        payload: IPlayer;
        response: { player: IPlayer };
    };
}

const { backend, frontend } = implementEndpoints<IPlayerService>({
    getPlayer: {
        method: "post",
        slug: "/get-player",
    },
    registerNewPlayer: {
        method: "post",
        slug: "/new-player",
    },
    updatePlayer: {
        method: "post",
        slug: "/update-player",
    },
});

export const PlayerServiceBackend = backend;
export const PlayerServiceFrontend = frontend;

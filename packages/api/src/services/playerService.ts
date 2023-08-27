/*
 * Copyright 2023 KM.
 */

import { type IImplementEndpoint, type IService } from "../common/generics";
import { type IPlayer } from "../types/politicalCapitalTwo";

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

export const PlayerService: IImplementEndpoint<IPlayerService> = {
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
};

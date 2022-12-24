/**
 * Copyright (c) 2022 - KM
 */

import { ActiveGameBackend, PlayerServiceBackend } from "@pc2/api";
import Express from "express";
import {
    changeActiveGameState,
    createNewGame,
    getGameState,
    joinActiveGame,
    readyPlayer,
} from "../services/gameService";
import { getPlayer, registerNewPlayer, updatePlayer } from "../services/playerService";
import { configureFrontendRoutes } from "./configureFrontendRoutes";

export function configureAllRoutes(app: Express.Express) {
    app.get("/status", (_req, res) => {
        res.status(200).send({ message: "success" });
    });

    PlayerServiceBackend(app, {
        getPlayer,
        registerNewPlayer,
        updatePlayer,
    });

    ActiveGameBackend(app, {
        createNewGame,
        joinActiveGame,
        readyPlayer,
        changeActiveGameState,
        getGameState,
    });

    configureFrontendRoutes(app);
}

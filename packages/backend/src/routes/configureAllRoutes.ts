/**
 * Copyright (c) 2022 - KM
 */

import { ActiveGameBackend, PlayerServiceBackend, PoliticalCapitalTwoServiceBackend } from "@pc2/api";
import Express from "express";
import {
    changeActiveGameState,
    createNewGame,
    getGameState,
    joinActiveGame,
    changeReadyState,
} from "../services/gameService";
import { getPlayer, registerNewPlayer, updatePlayer } from "../services/playerService";
import { recruitStaffer, trainStaffer, castVote } from "../services/politicalCapitalTwoService";
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
        changeReadyState,
        changeActiveGameState,
        getGameState,
    });

    PoliticalCapitalTwoServiceBackend(app, {
        recruitStaffer,
        trainStaffer,
        castVote,
    });

    configureFrontendRoutes(app);
}

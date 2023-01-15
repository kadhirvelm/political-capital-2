/**
 * Copyright (c) 2022 - KM
 */

import {
    ActiveGameBackend,
    NotificationServiceBackend,
    PlayerServiceBackend,
    PoliticalCapitalTwoServiceBackend,
} from "@pc2/api";
import Express from "express";
import {
    changeActiveGameState,
    createNewGame,
    getGameState,
    joinActiveGame,
    changeReadyState,
    getActiveGameState,
    getHistoricalGame,
} from "../services/gameService";
import { createNewNotification, getAllNotifications, markNotificationAsRead } from "../services/notificationService";
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
        getActiveGameState,
        getHistoricalGame,
    });

    NotificationServiceBackend(app, {
        createNewNotification,
        getAllNotifications,
        markNotificationAsRead,
    });

    PoliticalCapitalTwoServiceBackend(app, {
        recruitStaffer,
        trainStaffer,
        castVote,
    });

    configureFrontendRoutes(app);
}

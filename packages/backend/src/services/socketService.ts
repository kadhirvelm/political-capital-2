/**
 * Copyright (c) 2022 - KM
 */

import { IPlayer } from "@pc2/api";
import { WebSocketServer, WebSocket } from "ws";

interface IAddPlayerId extends WebSocket {
    playerId: string;
}

const socketsToPlayerMapping: Map<string, IAddPlayerId> = new Map();

const POLITICAL_CAPITAL_WEBSOCKET = new WebSocketServer({ port: 3003 });

POLITICAL_CAPITAL_WEBSOCKET.on("connection", (socketConnection: IAddPlayerId) => {
    socketConnection.on("message", (data) => {
        const parsedData: IPlayer = JSON.parse(data.toString());

        if (parsedData.playerRid === undefined) {
            return;
        }

        socketsToPlayerMapping.set(parsedData.playerRid, socketConnection);
        socketConnection.playerId = parsedData.playerRid;
    });

    socketConnection.on("close", () => {
        if (socketConnection.playerId === undefined) {
            return;
        }

        socketsToPlayerMapping.delete(socketConnection.playerId);
    });
});

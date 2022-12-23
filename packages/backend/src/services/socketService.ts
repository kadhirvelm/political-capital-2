/**
 * Copyright (c) 2022 - KM
 */

import { IFromPlayerMessages, IPlayerRid, IPossibleFromPlayerMessages, IPossibleToPlayerMessages } from "@pc2/api";
import { WebSocket, WebSocketServer } from "ws";

interface IAddPlayerId extends WebSocket {
    playerRid: IPlayerRid;
}

const socketsToPlayerMapping: Map<IPlayerRid, IAddPlayerId> = new Map();

const POLITICAL_CAPITAL_WEBSOCKET = new WebSocketServer({ port: 3003 });

POLITICAL_CAPITAL_WEBSOCKET.on("connection", (socketConnection: IAddPlayerId) => {
    socketConnection.on("message", (data: string) => {
        const parsedMessage: IPossibleFromPlayerMessages = JSON.parse(data.toString());

        IFromPlayerMessages.visit(parsedMessage, {
            registerPlayer: (registerPlayer) => {
                const maybeExistingSocketForPlayer = socketsToPlayerMapping.get(registerPlayer.player.playerRid);
                if (maybeExistingSocketForPlayer !== undefined) {
                    maybeExistingSocketForPlayer.terminate();
                }

                socketsToPlayerMapping.set(registerPlayer.player.playerRid, socketConnection);
                socketConnection.playerRid = registerPlayer.player.playerRid;
            },
            unknown: () => {},
        });
    });

    socketConnection.on("close", () => {
        if (socketConnection.playerRid === undefined) {
            return;
        }

        socketsToPlayerMapping.delete(socketConnection.playerRid);
    });
});

export function sendMessageToPlayer(playerRid: IPlayerRid, message: IPossibleToPlayerMessages) {
    const socket = socketsToPlayerMapping.get(playerRid);

    if (socket == null) {
        // This means the player is not connected to the server
        return;
    }

    socket.send(JSON.stringify(message));
}

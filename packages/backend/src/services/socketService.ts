/**
 * Copyright (c) 2022 - KM
 */

import {
    IFromPlayerMessages,
    IGlobalScreenIdentifier,
    IPlayerRid,
    IPossibleFromPlayerMessages,
    IPossibleToPlayerMessages,
} from "@pc2/api";
import { WebSocket, WebSocketServer } from "ws";

interface IAddPlayerId extends WebSocket {
    playerRid: IPlayerRid;
}

const socketsToPlayerMapping: Map<IPlayerRid, IAddPlayerId> = new Map();

interface IAddBrowserIdentifier extends WebSocket {
    globalScreenIdentifier: IGlobalScreenIdentifier;
}

const socketsToGlobalScreenMapping: Map<string, IAddBrowserIdentifier> = new Map();

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
            registerGlobalScreen: (registerGlobalScreen) => {
                const maybeExistingGlobalScreen = socketsToGlobalScreenMapping.get(
                    registerGlobalScreen.globalScreenIdentifier,
                );
                if (maybeExistingGlobalScreen !== undefined) {
                    maybeExistingGlobalScreen.terminate();
                }

                (socketConnection as unknown as IAddBrowserIdentifier).globalScreenIdentifier =
                    registerGlobalScreen.globalScreenIdentifier;

                socketsToGlobalScreenMapping.set(
                    registerGlobalScreen.globalScreenIdentifier,
                    socketConnection as unknown as IAddBrowserIdentifier,
                );
            },
            unknown: () => {},
        });
    });

    socketConnection.on("close", () => {
        if (socketConnection.playerRid === undefined) {
            return;
        }

        if (socketConnection.playerRid !== undefined) {
            socketsToPlayerMapping.delete(socketConnection.playerRid);
        }

        if ((socketConnection as unknown as IAddBrowserIdentifier).globalScreenIdentifier !== undefined) {
            socketsToGlobalScreenMapping.delete(
                (socketConnection as unknown as IAddBrowserIdentifier).globalScreenIdentifier,
            );
        }
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

export function areThereActiveGlobalScreens() {
    return socketsToGlobalScreenMapping.size > 0;
}

export function sendMessageToGlobalScreens(message: IPossibleToPlayerMessages) {
    for (const socket of socketsToGlobalScreenMapping.values()) {
        socket.send(JSON.stringify(message));
    }
}

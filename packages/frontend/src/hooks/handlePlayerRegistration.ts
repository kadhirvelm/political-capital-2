/**
 * Copyright (c) 2022 - KM
 */

import { useToast } from "@chakra-ui/react";
import { ActiveGameFrontend, IPossibleToPlayerMessages, IRegisterPlayer, PlayerServiceFrontend } from "@pc2/api";
import React from "react";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../store/createStore";
import { handleGameMessage } from "../store/gameState";
import { isConnectedToServer, disconnectedFromServer, setPlayer } from "../store/playerState";
import { checkIsError } from "../utility/alertOnError";
import { sleep } from "../utility/sleep";
import { v4 } from "uuid";

const BROWSER_RID_KEY = "Political_Capital_Two_Browser_Rid";

export const getOrCreateBrowserRid = () => {
    let maybeExistingBrowserRid: string | null = window.localStorage.getItem(BROWSER_RID_KEY);
    if (maybeExistingBrowserRid == null) {
        maybeExistingBrowserRid = v4();

        window.localStorage.setItem(BROWSER_RID_KEY, maybeExistingBrowserRid);
    }

    return maybeExistingBrowserRid;
};

export function useHandlePlayerAndSocketRegistration() {
    const browserIdentifier = getOrCreateBrowserRid();

    const toast = useToast();

    const webSocket = React.useRef<WebSocket | undefined>(undefined);

    const dispatch = usePoliticalCapitalDispatch();

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);

    const maybeGetExistingPlayer = async () => {
        const maybePlayer = checkIsError(await PlayerServiceFrontend.getPlayer({ browserIdentifier }));

        if (maybePlayer === undefined || maybePlayer.player === undefined) {
            dispatch(isConnectedToServer());
            return;
        }

        dispatch(setPlayer(maybePlayer.player));
    };

    const registerNewSocket = () => {
        if (player === undefined || webSocket.current !== undefined) {
            return;
        }

        const newWebSocket = new WebSocket(`ws://${window.location.hostname}:3003/`);
        webSocket.current = newWebSocket;

        newWebSocket.onopen = async () => {
            const registerPlayer: IRegisterPlayer = { player, type: "register-player" };
            newWebSocket.send(JSON.stringify(registerPlayer));

            toast({
                title: "Success",
                description: "Logged in and connected to the server.",
                status: "success",
                duration: 2000,
            });

            await ActiveGameFrontend.joinActiveGame({ playerRid: player.playerRid });
            dispatch(isConnectedToServer());
        };

        newWebSocket.onclose = async () => {
            webSocket.current = undefined;

            toast({
                title: "Disconnected",
                description: "Connection to the server was lost, attempting to reconnect in 5 seconds.",
                status: "error",
                duration: 2000,
            });

            dispatch(disconnectedFromServer());
            await sleep(5);
            registerNewSocket();
        };

        newWebSocket.onerror = () => {
            newWebSocket.close();
        };

        newWebSocket.onmessage = (message: MessageEvent<IPossibleToPlayerMessages>) => {
            dispatch(handleGameMessage(JSON.parse(message.data as any)));
        };
    };

    React.useEffect(() => {
        maybeGetExistingPlayer();
    }, []);

    React.useEffect(() => {
        registerNewSocket();
    }, [player, webSocket]);
}

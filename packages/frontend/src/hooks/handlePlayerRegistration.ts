/**
 * Copyright (c) 2022 - KM
 */

import { useToast } from "@chakra-ui/react";
import { IPossibleToPlayerMessages, IRegisterPlayer, PlayerServiceFrontend } from "@pc2/api";
import React from "react";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../store/createStore";
import { handleGameMessage } from "../store/gameState";
import { setPlayer } from "../store/playerState";
import { checkIsError } from "../utility/alertOnError";

const BROWSER_RID_KEY = "Political_Capital_Two_Browser_Rid";

export const getOrCreateBrowserRid = () => {
    let maybeExistingBrowserRid: string | null = window.localStorage.getItem(BROWSER_RID_KEY);
    if (maybeExistingBrowserRid == null) {
        maybeExistingBrowserRid = crypto.randomUUID();

        window.localStorage.setItem(BROWSER_RID_KEY, maybeExistingBrowserRid);
    }

    return maybeExistingBrowserRid;
};

export function useHandlePlayerAndSocketRegistration() {
    const browserIdentifier = getOrCreateBrowserRid();

    const toast = useToast();

    const [isLoading, setIsLoading] = React.useState(true);
    const [webSocket, setWebSocket] = React.useState<WebSocket | undefined>(undefined);

    const dispatch = usePoliticalCapitalDispatch();
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);

    const maybeGetExistingPlayer = async () => {
        const maybePlayer = checkIsError(await PlayerServiceFrontend.getPlayer({ browserIdentifier }));
        setIsLoading(false);

        if (maybePlayer === undefined || maybePlayer.player === undefined) {
            return;
        }

        dispatch(setPlayer(maybePlayer.player));
    };

    const registerNewSocket = () => {
        if (player === undefined || webSocket !== undefined) {
            return;
        }

        const newWebSocket = new WebSocket("ws://localhost:3003/");

        newWebSocket.onopen = () => {
            const registerPlayer: IRegisterPlayer = { player, type: "register-player" };
            newWebSocket.send(JSON.stringify(registerPlayer));

            setWebSocket(newWebSocket);

            toast({
                title: "Success",
                description: "Logged in and connected to the server.",
                status: "success",
                duration: 2000,
            });
        };

        newWebSocket.onclose = () => {
            setWebSocket(undefined);
            toast({
                title: "Disconnected",
                description: "Connection to the server was lost, please refresh the page.",
                status: "error",
                duration: 2000,
            });
        };

        newWebSocket.onerror = (error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            setWebSocket(undefined);
            toast({
                title: "Disconnected",
                description: "Connection to the server was lost due to an error, please refresh the page.",
                status: "error",
                duration: 2000,
            });
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

    return {
        isLoading,
        webSocket,
    };
}

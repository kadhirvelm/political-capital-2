/**
 * Copyright (c) 2022 - KM
 */

import { useToast } from "@chakra-ui/react";
import { IPlayer, PlayerServiceFrontend } from "@pc2/api";
import React from "react";
import { checkIsError } from "../utility/alertOnError";

const BROWSER_RID_KEY = "Political_Capital_Two_Browser_Rid";

const getOrCreateBrowserRid = () => {
    let maybeExistingBrowserRid: string | null = window.localStorage.getItem(BROWSER_RID_KEY);
    if (maybeExistingBrowserRid == null) {
        maybeExistingBrowserRid = crypto.randomUUID();

        window.localStorage.setItem(BROWSER_RID_KEY, maybeExistingBrowserRid);
    }

    return maybeExistingBrowserRid;
};

export function useHandlePlayerRegistration() {
    const browserIdentifier = getOrCreateBrowserRid();

    const toast = useToast();

    const [isLoading, setIsLoading] = React.useState(true);
    const [player, setPlayer] = React.useState<IPlayer | undefined>(undefined);
    const [webSocket, setWebSocket] = React.useState<WebSocket | undefined>(undefined);

    const maybeGetExistingPlayer = async () => {
        const maybePlayer = checkIsError(await PlayerServiceFrontend.getPlayer({ browserIdentifier }));
        setIsLoading(false);

        if (maybePlayer === undefined) {
            return;
        }

        setPlayer(maybePlayer.player);
    };

    const registerNewSocket = () => {
        if (player === undefined || webSocket !== undefined) {
            return;
        }

        const newWebSocket = new WebSocket("ws://localhost:3003/");

        newWebSocket.onopen = () => {
            newWebSocket.send(JSON.stringify({ ...player, type: "player" }));
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

        newWebSocket.onerror = () => {
            setWebSocket(undefined);
            toast({
                title: "Disconnected",
                description: "Connection to the server was lost, please refresh the page.",
                status: "error",
                duration: 2000,
            });
        };

        newWebSocket.onmessage = (message) => {
            console.log("Received message ", message);
        };
    };

    React.useEffect(() => {
        maybeGetExistingPlayer();
    }, []);

    React.useEffect(() => {
        registerNewSocket();
    }, [player, webSocket]);

    return {
        browserIdentifier,
        isLoading,
        player,
    };
}

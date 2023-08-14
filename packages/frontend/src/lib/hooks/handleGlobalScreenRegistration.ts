/**
 * Copyright (c) 2022 - KM
 */

import { useToast } from "@chakra-ui/react";
import {
    ActiveGameFrontend,
    IGlobalScreenIdentifier,
    IPossibleToPlayerMessages,
    IRegisterGlobalScreen,
} from "@pc2/api";
import { useEffect, useRef } from "react";
import { v4 } from "uuid";
import { usePoliticalCapitalDispatch } from "../store/createStore";
import { handleGameMessage } from "../store/gameState";
import { disconnectedFromServer, isConnectedToServer } from "../store/playerState";
import { sleep } from "../utility/sleep";

const GLOBAL_SCREEN_RID_KEY = "Political_Capital_Two_Global_Screen_Rid";

const getOrCreateGlobalScreenIdentifier = () => {
    let maybeExistingGlobalScreenRid: string | null = window.localStorage.getItem(GLOBAL_SCREEN_RID_KEY);
    if (maybeExistingGlobalScreenRid == null) {
        maybeExistingGlobalScreenRid = v4();

        window.localStorage.setItem(GLOBAL_SCREEN_RID_KEY, maybeExistingGlobalScreenRid);
    }

    return maybeExistingGlobalScreenRid as IGlobalScreenIdentifier;
};

export function useHandleGlobalScreenRegistration() {
    const globalScreenIdentifier = getOrCreateGlobalScreenIdentifier();

    const toast = useToast();

    const webSocket = useRef<WebSocket | undefined>(undefined);

    const dispatch = usePoliticalCapitalDispatch();

    const registerNewSocket = () => {
        if (webSocket.current !== undefined) {
            return;
        }

        const newWebSocket = new WebSocket(`ws://${window.location.hostname}:3003/`);
        webSocket.current = newWebSocket;

        newWebSocket.onopen = async () => {
            const registerGlobalScreen: IRegisterGlobalScreen = {
                globalScreenIdentifier,
                type: "register-global-screen",
            };
            newWebSocket.send(JSON.stringify(registerGlobalScreen));

            toast({
                title: "Success",
                description: "Registered as a global screen and connected to the server.",
                status: "success",
                duration: 2000,
            });

            await ActiveGameFrontend.getActiveGameState({ globalScreenIdentifier });
            dispatch(isConnectedToServer());
        };

        newWebSocket.onclose = async () => {
            webSocket.current = undefined;

            toast({
                title: "Disconnected",
                description: "Connection to the server was lost, attempting to reconnect in 3 seconds.",
                status: "error",
                duration: 2000,
            });

            dispatch(disconnectedFromServer());
            await sleep(3);
            registerNewSocket();
        };

        newWebSocket.onerror = () => {
            newWebSocket.close();
        };

        newWebSocket.onmessage = (message: MessageEvent<IPossibleToPlayerMessages>) => {
            dispatch(handleGameMessage(JSON.parse(message.data as any)));
        };
    };

    useEffect(() => {
        registerNewSocket();
    }, [webSocket]);
}

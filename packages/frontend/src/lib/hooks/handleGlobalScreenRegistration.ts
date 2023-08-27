/*
 * Copyright 2023 KM.
 */

import { useToast } from "@chakra-ui/react";
import {
  ActiveGameFrontend,
  type IGlobalScreenIdentifier,
  type IPossibleToPlayerMessages,
  type IRegisterGlobalScreen,
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
  if (maybeExistingGlobalScreenRid == undefined) {
    maybeExistingGlobalScreenRid = v4();

    window.localStorage.setItem(GLOBAL_SCREEN_RID_KEY, maybeExistingGlobalScreenRid);
  }

  return maybeExistingGlobalScreenRid as IGlobalScreenIdentifier;
};

export function useHandleGlobalScreenRegistration() {
  const globalScreenIdentifier = getOrCreateGlobalScreenIdentifier();

  const toast = useToast();

  const webSocket = useRef<WebSocket | undefined>();

  const dispatch = usePoliticalCapitalDispatch();

  const registerNewSocket = () => {
    if (webSocket.current !== undefined) {
      return;
    }

    const newWebSocket = new WebSocket(`ws://${window.location.hostname}:3003/`);
    webSocket.current = newWebSocket;

    newWebSocket.addEventListener("open", async () => {
      const registerGlobalScreen: IRegisterGlobalScreen = {
        globalScreenIdentifier,
        type: "register-global-screen",
      };
      newWebSocket.send(JSON.stringify(registerGlobalScreen));

      toast({
        description: "Registered as a global screen and connected to the server.",
        duration: 2000,
        status: "success",
        title: "Success",
      });

      await ActiveGameFrontend.getActiveGameState({ globalScreenIdentifier });
      dispatch(isConnectedToServer());
    });

    newWebSocket.addEventListener("close", async () => {
      webSocket.current = undefined;

      toast({
        description: "Connection to the server was lost, attempting to reconnect in 3 seconds.",
        duration: 2000,
        status: "error",
        title: "Disconnected",
      });

      dispatch(disconnectedFromServer());
      await sleep(3);
      registerNewSocket();
    });

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

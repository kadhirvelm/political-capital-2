/*
 * Copyright 2023 KM.
 */

import { useToast } from "@chakra-ui/react";
import {
  ActiveGameFrontend,
  type IPossibleToPlayerMessages,
  type IRegisterPlayer,
  PlayerServiceFrontend,
} from "@pc2/api";
import { useEffect, useRef } from "react";
import { v4 } from "uuid";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../store/createStore";
import { handleGameMessage } from "../store/gameState";
import { disconnectedFromServer, isConnectedToServer, setPlayer } from "../store/playerState";
import { checkIsError } from "../utility/alertOnError";
import { sleep } from "../utility/sleep";

const BROWSER_RID_KEY = "Political_Capital_Two_Browser_Rid";

export const getOrCreateBrowserRid = () => {
  let maybeExistingBrowserRid: string | null = window.localStorage.getItem(BROWSER_RID_KEY);
  if (maybeExistingBrowserRid == undefined) {
    maybeExistingBrowserRid = v4();

    window.localStorage.setItem(BROWSER_RID_KEY, maybeExistingBrowserRid);
  }

  return maybeExistingBrowserRid;
};

export function useHandlePlayerAndSocketRegistration() {
  const browserIdentifier = "test"; // getOrCreateBrowserRid();

  const toast = useToast();

  const dispatch = usePoliticalCapitalDispatch();

  const player = usePoliticalCapitalSelector((s) => s.playerState.player);

  const webSocket = useRef<WebSocket | undefined>();

  const maybeGetExistingPlayer = async () => {
    const maybePlayer = checkIsError(await PlayerServiceFrontend.getPlayer({ browserIdentifier }), toast);

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

    newWebSocket.addEventListener("open", async () => {
      const registerPlayer: IRegisterPlayer = { player, type: "register-player" };
      newWebSocket.send(JSON.stringify(registerPlayer));

      toast({
        description: "Logged in and connected to the server.",
        duration: 2000,
        status: "success",
        title: "Success",
      });

      await ActiveGameFrontend.joinActiveGame({ playerRid: player.playerRid });
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
    maybeGetExistingPlayer();
  }, []);

  useEffect(() => {
    registerNewSocket();
  }, [player, webSocket]);
}

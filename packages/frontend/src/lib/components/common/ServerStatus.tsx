/*
 * Copyright 2023 KM.
 */

import { usePoliticalCapitalSelector } from "../../store/createStore";
import classNames from "classnames";
import styles from "./ServerStatus.module.scss";
import { TimeIcon } from "@chakra-ui/icons";
import { CircularProgress } from "@chakra-ui/react";
import { type IGameClock } from "@pc2/api";
import { type FC, useState, useEffect } from "react";

export function getFakeDate(gameClock: IGameClock, month: "short" | "long" = "short"): string {
  const initialFakeDate = new Date("January 1, 2022");
  initialFakeDate.setDate(initialFakeDate.getDate() + gameClock);

  return initialFakeDate.toLocaleDateString("default", { day: "numeric", month, year: undefined });
}

export const ServerStatus: FC<{}> = () => {
  const [progressCounter, setProgressCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressCounter(new Date().getSeconds() % 5);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const isConnectedToServer = usePoliticalCapitalSelector((s) => s.playerState.isConnectedToServer);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

  if (fullGameState?.gameState.state === "waiting") {
    return null;
  }

  const maybeRenderGameIndicator = () => {
    if (fullGameState === undefined) {
      return;
    }

    return (
      <div className={styles.currentTime}>
        {(fullGameState.gameState.state === "waiting" || fullGameState.gameState.state === "paused") && (
          <TimeIcon className={styles.pauseIcon} />
        )}
        {fullGameState.gameState.state === "active" && (
          <CircularProgress className={styles.progressCounter} max={4} min={0} size="20px" value={progressCounter} />
        )}
        {getFakeDate(fullGameState.gameState.gameClock)}
      </div>
    );
  };

  return (
    <div className={styles.serverStatus}>
      {maybeRenderGameIndicator()}
      <div
        className={classNames(styles.connectedIndicator, {
          [styles.isConnected]: isConnectedToServer,
          [styles.disconnected]: !isConnectedToServer,
        })}
      />
    </div>
  );
};

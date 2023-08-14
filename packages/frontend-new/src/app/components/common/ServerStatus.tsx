/**
 * Copyright (c) 2022 - KM
 */

"use client";

import { usePoliticalCapitalSelector } from "../../store/createStore";
import classNames from "classnames";
import styles from "./ServerStatus.module.scss";
import { TimeIcon } from "@chakra-ui/icons";
import { CircularProgress } from "@chakra-ui/react";
import { IGameClock } from "@pc2/api";
import { FC, useState, useEffect } from "react";

export function getFakeDate(gameClock: IGameClock, month: "short" | "long" = "short"): string {
    const initialFakeDate = new Date("January 1, 2022");
    initialFakeDate.setDate(initialFakeDate.getDate() + gameClock);

    return initialFakeDate.toLocaleDateString("default", { year: undefined, month, day: "numeric" });
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
            return undefined;
        }

        return (
            <div className={styles.currentTime}>
                {(fullGameState.gameState.state === "waiting" || fullGameState.gameState.state === "paused") && (
                    <TimeIcon className={styles.pauseIcon} />
                )}
                {fullGameState.gameState.state === "active" && (
                    <CircularProgress
                        className={styles.progressCounter}
                        min={0}
                        max={4}
                        value={progressCounter}
                        size="20px"
                    />
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

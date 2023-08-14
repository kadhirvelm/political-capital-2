/**
 * Copyright (c) 2022 - KM
 */

"use client";

import { TimeIcon } from "@chakra-ui/icons";
import { CircularProgress } from "@chakra-ui/react";
import classNames from "classnames";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getFakeDate } from "../common/ServerStatus";
import styles from "./GameClock.module.scss";
import { FC, useState, useEffect } from "react";

export const GameClock: FC<{}> = () => {
    const [progressCounter, setProgressCounter] = useState(0);

    const isConnectedToServer = usePoliticalCapitalSelector((s) => s.playerState.isConnectedToServer);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgressCounter(new Date().getSeconds() % 5);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

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
                        size="2.5vw"
                    />
                )}
                <div className={styles.fullDate}>{getFakeDate(fullGameState.gameState.gameClock, "long")}</div>
            </div>
        );
    };

    return (
        <>
            <div className={styles.serverStatus}>
                <div
                    className={classNames(styles.connectedIndicator, {
                        [styles.isConnected]: isConnectedToServer,
                        [styles.disconnected]: !isConnectedToServer,
                    })}
                />
            </div>
            {maybeRenderGameIndicator()}
        </>
    );
};

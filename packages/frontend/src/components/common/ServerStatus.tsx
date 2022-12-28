/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import classNames from "classnames";
import styles from "./ServerStatus.module.scss";
import { TimeIcon } from "@chakra-ui/icons";
import { CircularProgress } from "@chakra-ui/react";
import { IGameClock } from "@pc2/api";

export function getFakeDate(gameClock: IGameClock): string {
    const initialFakeDate = new Date("January 1, 2022");
    initialFakeDate.setDate(initialFakeDate.getDate() + gameClock);

    return initialFakeDate.toLocaleDateString("default", { year: undefined, month: "short", day: "numeric" });
}

export const ServerStatus: React.FC<{}> = () => {
    const [progressCounter, setProgressCounter] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgressCounter(new Date().getSeconds() % 10);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const isConnectedToServer = usePoliticalCapitalSelector((s) => s.playerState.isConnectedToServer);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

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
                        max={9}
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

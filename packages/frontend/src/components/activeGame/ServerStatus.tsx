/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import classNames from "classnames";
import styles from "./ServerStatus.module.scss";

export const ServerStatus: React.FC<{}> = () => {
    const isConnectedToServer = usePoliticalCapitalSelector((s) => s.playerState.isConnectedToServer);

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const maybeRenderCurrentTime = () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        const initialFakeDate = new Date("January 1, 2022");
        initialFakeDate.setDate(initialFakeDate.getDate() + fullGameState.gameState.gameClock);

        return (
            <div className={styles.currentTime}>
                {initialFakeDate.toLocaleDateString("default", { year: undefined, month: "short", day: "numeric" })}
            </div>
        );
    };

    return (
        <div className={styles.serverStatus}>
            {maybeRenderCurrentTime()}
            <div
                className={classNames(styles.connectedIndicator, {
                    [styles.isConnected]: isConnectedToServer,
                    [styles.disconnected]: !isConnectedToServer,
                })}
            />
        </div>
    );
};

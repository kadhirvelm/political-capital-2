/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import classNames from "classnames";
import styles from "./ServerStatus.module.scss";

export const ServerStatus: React.FC<{}> = () => {
    const isConnectedToServer = usePoliticalCapitalSelector((s) => s.playerState.isConnectedToServer);

    return (
        <div
            className={classNames(styles.serverStatus, {
                [styles.isConnected]: isConnectedToServer,
                [styles.disconnected]: !isConnectedToServer,
            })}
        />
    );
};

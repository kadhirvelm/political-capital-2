/**
 * Copyright (c) 2022 - KM
 */

"use client";

import { FC } from "react";
import { useHandlePlayerAndSocketRegistration } from "../hooks/handlePlayerRegistration";
import { usePoliticalCapitalSelector } from "../store/createStore";
import { ActiveGame } from "./activeGame/ActiveGame";
import { ServerStatus } from "./common/ServerStatus";
import { Lobby } from "./lobby/Lobby";
import styles from "./PoliticalCapitalTwo.module.scss";
import { RegisterPlayerModal } from "./registerPlayer/RegisterPlayerModal";

type IRenderGameState = "loading" | "lobby" | "game";

export const PoliticalCapitalTwo: FC<{}> = () => {
    useHandlePlayerAndSocketRegistration();

    const isConnectedToServer = usePoliticalCapitalSelector((s) => s.playerState.isConnectedToServer);
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const activeGame = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const currentGameState: IRenderGameState = (() => {
        if (!isConnectedToServer) {
            return "loading";
        }

        if (player === undefined || activeGame === undefined || activeGame?.gameState.state === "waiting") {
            return "lobby";
        }

        return "game";
    })();

    const renderGameState = () => {
        if (currentGameState === "loading") {
            return <div className={styles.loading}>Loading…</div>;
        }

        if (currentGameState === "lobby") {
            return <Lobby />;
        }

        return <ActiveGame />;
    };

    return (
        <div className={styles.rootContainer}>
            <RegisterPlayerModal />
            <ServerStatus />
            {renderGameState()}
        </div>
    );
};

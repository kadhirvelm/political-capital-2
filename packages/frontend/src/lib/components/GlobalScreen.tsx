/**
 * Copyright (c) 2022 - KM
 */

import { FC } from "react";
import { useHandleGlobalScreenRegistration } from "../hooks/handleGlobalScreenRegistration";
import { usePlayGlobalSound } from "../hooks/playGlobalSound";
import { usePoliticalCapitalSelector } from "../store/createStore";
import styles from "./GlobalScreen.module.scss";
import { CurrentResolution } from "./globalScreen/CurrentResolution";
import { EndGameState } from "./globalScreen/EndGameState";
import { GameClock } from "./globalScreen/GameClock";
import { GlobalLeaderboard } from "./globalScreen/GlobalLeaderboard";

export const GlobalScreen: FC<{}> = () => {
    useHandleGlobalScreenRegistration();
    usePlayGlobalSound();

    const activeGame = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const height = window.innerHeight;
    const width = window.innerWidth;

    if (height < 1000 || width < 1000) {
        return <div>This screen is not big enough for the global screen.</div>;
    }

    if (activeGame === undefined) {
        return null;
    }

    if (activeGame.gameState.state === "complete") {
        return <EndGameState />;
    }

    return (
        <div className={styles.globalScreen}>
            <div className={styles.leftSide}>
                <CurrentResolution />
            </div>
            <div className={styles.rightSide}>
                <div>
                    <GameClock />
                </div>
                <div>
                    <GlobalLeaderboard />
                </div>
            </div>
        </div>
    );
};

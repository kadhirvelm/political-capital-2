/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { getLeaderboard } from "../../selectors/leaderboard";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { roundToHundred } from "../../utility/roundTo";
import { PartySummary } from "../activeGame/PartySummary";
import styles from "./GlobalLeaderboard.module.scss";

export const GlobalLeaderboard: React.FC<{}> = () => {
    const gameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState?.gameState);

    const leaderboard = usePoliticalCapitalSelector(getLeaderboard);

    return (
        <div className={styles.leaderboard}>
            <div className={styles.leaderboardTable}>
                {leaderboard.map((leaderboardPlayer, index) => (
                    <div className={styles.singleRow} key={leaderboardPlayer.player.playerRid}>
                        <div className={styles.details}>
                            <div className={styles.name}>
                                {index + 1}. {leaderboardPlayer.player.name}
                            </div>
                            {gameState?.state === "complete" && (
                                <div>
                                    {roundToHundred(leaderboardPlayer.activePlayer.politicalCapital).toLocaleString()}{" "}
                                    political capital
                                </div>
                            )}
                        </div>
                        {gameState?.state === "complete" && (
                            <PartySummary playerRid={leaderboardPlayer.player.playerRid} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

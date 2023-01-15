/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { getLeaderboard } from "../../selectors/leaderboard";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { roundToHundred } from "../../utility/roundTo";
import { PartySummary } from "../activeGame/PartySummary";
import { PlayerName } from "../common/StafferName";
import styles from "./GlobalLeaderboard.module.scss";

export const GlobalLeaderboard: React.FC<{}> = () => {
    const gameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState?.gameState);

    const leaderboard = usePoliticalCapitalSelector(getLeaderboard);

    return (
        <div className={styles.leaderboard}>
            <div className={styles.leaderboardTable}>
                {leaderboard.map((leaderboardPlayer, index) => (
                    <div className={styles.singleRow} key={leaderboardPlayer.player.playerRid}>
                        <div className={styles.playerIcon}>
                            <PlayerName
                                player={leaderboardPlayer.player}
                                activePlayer={leaderboardPlayer.activePlayer}
                            />
                        </div>
                        <div className={styles.playerDetailsContainer}>
                            <div className={styles.name}>
                                <div>{index + 1}.</div>
                                <div>{leaderboardPlayer.player.name}</div>
                            </div>
                            {gameState?.state === "complete" && (
                                <div className={styles.politicalCapitalContainer}>
                                    <div className={styles.politicalCapital}>Political capital</div>
                                    {roundToHundred(
                                        leaderboardPlayer.activePlayer.politicalCapital,
                                    ).toLocaleString()}{" "}
                                </div>
                            )}
                            {gameState?.state === "complete" && (
                                <PartySummary playerRid={leaderboardPlayer.player.playerRid} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

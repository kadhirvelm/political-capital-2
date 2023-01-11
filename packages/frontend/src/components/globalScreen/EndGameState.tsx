/**
 * Copyright (c) 2023 - KM
 */

import { useToast } from "@chakra-ui/react";
import { ActiveGameFrontend, IHistoricalGameState, IPlayer } from "@pc2/api";
import { keyBy } from "lodash-es";
import * as React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { checkIsError } from "../../utility/alertOnError";
import styles from "./EndGameState.module.scss";
import { GlobalLeaderboard } from "./GlobalLeaderboard";

const UNIQUE_COLORS = [
    "#4CAF50",
    "#03A9F4",
    "#FF5722",
    "#F44336",
    "#FFEB3B",
    "#9C27B0",
    "#4DD0E1",
    "#795548",
    "#9E9E9E",
    "#212121",
];

function createLines(historicalGameState: IHistoricalGameState[], players: IPlayer[]) {
    const playersIndexed = keyBy(players, (p) => p.playerRid);

    const series: Array<{ [value: string]: number }> = [];
    const uniquePlayers: { [playerRid: string]: true } = {};

    historicalGameState.forEach((singleTimePoint) => {
        const thisTimePoint: { [value: string]: number } = { x: singleTimePoint.gameClock };
        singleTimePoint.snapshot.forEach((player) => {
            const playerName = playersIndexed[player.playerRid]?.name ?? player.playerRid;
            thisTimePoint[playerName] = player.politicalCapital;
            uniquePlayers[playerName] = true;
        });

        series.push(thisTimePoint);
    });

    series.sort((a, b) => (a.x > b.x ? 1 : -1));

    return { series, uniquePlayers: Object.keys(uniquePlayers) };
}

export const EndGameState: React.FC<{}> = () => {
    const toast = useToast();

    const [players, setPlayers] = React.useState<IPlayer[] | undefined>(undefined);
    const [historicalGameState, setHistoricalGameState] = React.useState<IHistoricalGameState[] | undefined>(undefined);

    const activeGame = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const fetchHistoricalGameState = async () => {
        if (activeGame === undefined) {
            return;
        }

        const historicalGame = checkIsError(
            await ActiveGameFrontend.getHistoricalGame({
                gameStateRid: activeGame.gameState.gameStateRid,
            }),
            toast,
        );
        if (historicalGame === undefined) {
            return;
        }

        setHistoricalGameState(historicalGame.historicalGame);
        setPlayers(historicalGame.players);
    };

    React.useEffect(() => {
        if (activeGame?.gameState.state !== "complete" || historicalGameState !== undefined) {
            return;
        }

        fetchHistoricalGameState();
    }, [activeGame?.gameState.state]);

    if (activeGame === undefined || activeGame?.gameState.state !== "complete") {
        return null;
    }

    if (historicalGameState === undefined || players === undefined) {
        return <div>Loading</div>;
    }

    const { series, uniquePlayers } = createLines(historicalGameState, players);

    return (
        <div className={styles.overallContainer}>
            <div className={styles.chart}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series}>
                        <CartesianGrid strokeDasharray="5" stroke="#ECEFF1" />
                        <XAxis dataKey="x" />
                        <YAxis />
                        <Legend />
                        {uniquePlayers.map((playerRid, index) => (
                            <Line
                                dataKey={playerRid}
                                stroke={UNIQUE_COLORS[index]}
                                type="monotone"
                                strokeWidth={3}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className={styles.globalLeaderboard}>
                <GlobalLeaderboard />
            </div>
        </div>
    );
};

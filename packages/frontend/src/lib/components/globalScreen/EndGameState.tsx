/*
 * Copyright 2023 KM.
 */

import { useToast } from "@chakra-ui/react";
import { ActiveGameFrontend, type IHistoricalGameState, type IPlayer } from "@pc2/api";
import { keyBy } from "lodash-es";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { checkIsError } from "../../utility/alertOnError";
import styles from "./EndGameState.module.scss";
import { GlobalLeaderboard } from "./GlobalLeaderboard";
import { type FC, useState, useEffect } from "react";

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

  for (const singleTimePoint of historicalGameState) {
    const thisTimePoint: { [value: string]: number } = { x: singleTimePoint.gameClock };
    for (const player of singleTimePoint.snapshot) {
      const playerName = playersIndexed[player.playerRid]?.name ?? player.playerRid;
      thisTimePoint[playerName] = player.politicalCapital;
      uniquePlayers[playerName] = true;
    }

    series.push(thisTimePoint);
  }

  series.sort((a, b) => (a.x > b.x ? 1 : -1));

  return { series, uniquePlayers: Object.keys(uniquePlayers) };
}

export const EndGameState: FC<{}> = () => {
  const toast = useToast();

  const [players, setPlayers] = useState<IPlayer[] | undefined>();
  const [historicalGameState, setHistoricalGameState] = useState<IHistoricalGameState[] | undefined>();

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

  useEffect(() => {
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
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={series}>
            <CartesianGrid stroke="#ECEFF1" strokeDasharray="5" />
            <XAxis dataKey="x" />
            <YAxis />
            <Legend />
            {uniquePlayers.map((playerRid, index) => (
              <Line
                dataKey={playerRid}
                dot={false}
                key={playerRid}
                stroke={UNIQUE_COLORS[index]}
                strokeWidth={3}
                type="monotone"
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

/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";

export const ActiveGame: React.FC<{}> = () => {
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    if (fullGameState === undefined) {
        return null;
    }

    return <div>We're in a game! {fullGameState.gameState.gameClock}</div>;
};

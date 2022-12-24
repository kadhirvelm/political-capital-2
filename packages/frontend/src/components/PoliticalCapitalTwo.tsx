/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { usePoliticalCapitalSelector } from "../store/createStore";
import { Lobby } from "./lobby/Lobby";
import { RegisterPlayerModal } from "./registerPlayer/RegisterPlayerModal";

export const PoliticalCapitalTwo: React.FC<{}> = () => {
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const activeGame = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const maybeRenderLobby = () => {
        if (player === undefined || (activeGame !== undefined && activeGame.gameState.state === "waiting")) {
            return undefined;
        }

        return <Lobby />;
    };

    return (
        <div>
            <RegisterPlayerModal />
            {maybeRenderLobby()}
        </div>
    );
};

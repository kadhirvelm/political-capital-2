/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { usePoliticalCapitalSelector } from "../store/createStore";
import { ActiveGame } from "./activeGame/ActiveGame";
import { ServerStatus } from "./activeGame/ServerStatus";
import { Lobby } from "./lobby/Lobby";
import { RegisterPlayerModal } from "./registerPlayer/RegisterPlayerModal";

type IRenderGameState = "loading" | "lobby" | "game";

export const PoliticalCapitalTwo: React.FC<{}> = () => {
    const isConnectedToServer = usePoliticalCapitalSelector((s) => s.playerState.isConnectedToServer);
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const activeGame = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const renderGameState: IRenderGameState = (() => {
        if (!isConnectedToServer) {
            return "loading";
        }

        if (player === undefined || activeGame === undefined || activeGame?.gameState.state === "waiting") {
            return "lobby";
        }

        return "game";
    })();

    const maybeRenderLobby = () => {
        if (renderGameState === "loading") {
            return <div>Loading…</div>;
        }

        if (renderGameState === "lobby") {
            return <Lobby />;
        }

        return <ActiveGame />;
    };

    return (
        <div>
            <RegisterPlayerModal />
            <ServerStatus />
            {maybeRenderLobby()}
        </div>
    );
};

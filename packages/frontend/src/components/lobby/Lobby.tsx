/**
 * Copyright (c) 2022 - KM
 */

import { Button } from "@chakra-ui/react";
import { ActiveGameFrontend } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";

export const Lobby: React.FC<{}> = () => {
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const [isLoading, setIsLoading] = React.useState(false);

    if (player === undefined) {
        return null;
    }

    const onCreateNewGame = async () => {
        setIsLoading(true);
        await ActiveGameFrontend.createNewGame({ playerRid: player.playerRid });
        setIsLoading(false);
    };

    const maybeRenderGameState = () => {
        if (fullGameState === undefined) {
            return (
                <Button isLoading={isLoading} onClick={onCreateNewGame}>
                    Create new game
                </Button>
            );
        }

        return <div>{fullGameState.activePlayers.length}</div>;
    };

    return (
        <div>
            Hello {player.name}. This is the lobby. {maybeRenderGameState()}
        </div>
    );
};

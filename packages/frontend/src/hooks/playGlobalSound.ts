/**
 * Copyright (c) 2023 - KM
 */

import { IEvent, IGameState } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../store/createStore";

export function usePlayGlobalSound() {
    const activeGame = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    const [currentGameState, setCurrentGameState] = React.useState<IGameState["state"] | undefined>(undefined);

    const playNewResolution = () => {
        const audio = new Audio(`http://${window.location.hostname}:3002/new-resolution.mp3`);
        audio.play();
    };

    const playTallyResolution = () => {
        const audio = new Audio(`http://${window.location.hostname}:3002/tally-resolution.mp3`);
        audio.play();
    };

    const playGameStateSound = (gameState: IGameState["state"]) => {
        const audio = new Audio(`http://${window.location.hostname}:3002/${gameState}.mp3`);
        audio.play();
    };

    React.useEffect(() => {
        if (activeGame === undefined) {
            return;
        }

        activeGame.resolveEvents.game.forEach((event) => {
            if (IEvent.isNewResolution(event.eventDetails) && event.resolvesOn === activeGame.gameState.gameClock) {
                playNewResolution();
                return;
            }

            if (
                IEvent.isTallyResolution(event.eventDetails) &&
                event.resolvesOn - activeGame.gameState.gameClock === 3
            ) {
                playTallyResolution();
                return;
            }
        });

        const audio = new Audio("http://localhost:3002/notification.mp3");
        audio.play();
    }, [activeGame?.gameState.gameClock]);

    React.useEffect(() => {
        if (activeGame?.gameState.state === undefined || currentGameState === activeGame.gameState.state) {
            return;
        }

        playGameStateSound(activeGame?.gameState.state);
        setCurrentGameState(activeGame?.gameState.state);
    }, [activeGame?.gameState.state]);
}

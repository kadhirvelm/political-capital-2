/*
 * Copyright 2023 KM.
 */

import { IEvent, type IGameState } from "@pc2/api";
import { usePoliticalCapitalSelector } from "../store/createStore";
import { useState, useEffect } from "react";

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

export function usePlayGlobalSound() {
  const activeGame = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

  const [currentGameState, setCurrentGameState] = useState<IGameState["state"] | undefined>();

  useEffect(() => {
    if (activeGame === undefined) {
      return;
    }

    for (const event of activeGame.resolveEvents.game) {
      if (IEvent.isNewResolution(event.eventDetails) && event.resolvesOn === activeGame.gameState.gameClock) {
        playNewResolution();
      }

      if (IEvent.isTallyResolution(event.eventDetails) && event.resolvesOn - activeGame.gameState.gameClock === 3) {
        playTallyResolution();
      }
    }

    const audio = new Audio("http://localhost:3002/notification.mp3");
    audio.play();
  }, [activeGame?.gameState.gameClock]);

  useEffect(() => {
    if (activeGame?.gameState.state === undefined || currentGameState === activeGame.gameState.state) {
      return;
    }

    playGameStateSound(activeGame?.gameState.state);
    setCurrentGameState(activeGame?.gameState.state);
  }, [activeGame?.gameState.state]);
}

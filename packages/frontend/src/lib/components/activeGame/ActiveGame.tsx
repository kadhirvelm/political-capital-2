/*
 * Copyright 2023 KM.
 */

/* eslint-disable sonarjs/no-duplicate-string */

import { HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { type IGameState } from "@pc2/api";
import { useLoadPlayerNotifications } from "../../hooks/loadPlayerNotification";
import { getUnusedCapacity } from "../../selectors/staffers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import styles from "./ActiveGame.module.scss";
import { ActiveResolution } from "./ActiveResolution";
import { AllGameModifiers } from "./AllGameModifiers";
import { Leaderboard } from "./Leaderboard";
import { Messages } from "./Messages";
import { NotificationsModal } from "./NotificationsModal";
import { PlayerParty } from "./PlayerParty";
import { StafferLadders } from "./StafferLadders";
import React, { useState } from "react";
import { ActiveGameService } from "../../service/activeGame";

type ICurrentView =
  | "active-resolution"
  | "your-party"
  | "leaderboard"
  | "game-modifiers"
  | "messages"
  | "staffers-ladders";

export const ActiveGame = () => {
  useLoadPlayerNotifications();

  const [currentView, setCurrentView] = useState<ICurrentView>("active-resolution");

  const player = usePoliticalCapitalSelector((s) => s.playerState.player);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
  const notification = usePoliticalCapitalSelector(getUnusedCapacity);

  if (player === undefined || fullGameState === undefined) {
    return;
  }

  const onChangeState = (newState: IGameState["state"]) => () =>
    ActiveGameService.changeActiveGameState({ gameStateRid: fullGameState.gameState.gameStateRid, newState });

  const renderPauseOrResumeButton = () => {
    if (fullGameState.gameState.state === "active") {
      return (
        <MenuItem color="red" onClick={onChangeState("paused")}>
          Pause game
        </MenuItem>
      );
    }

    return (
      <MenuItem color="green" onClick={onChangeState("active")}>
        Resume game
      </MenuItem>
    );
  };

  const renderCurrentViewTitle = () => {
    if (currentView === "active-resolution") {
      return "Active resolution";
    }

    if (currentView === "your-party") {
      return "Your party";
    }

    if (currentView === "messages") {
      return "Messages";
    }

    if (currentView === "leaderboard") {
      return "Leaderboard";
    }

    if (currentView === "game-modifiers") {
      return "Game modifiers";
    }

    if (currentView === "staffers-ladders") {
      return "Staffer ladders";
    }
  };

  const renderCurrentView = () => {
    if (currentView === "active-resolution") {
      return <ActiveResolution />;
    }

    if (currentView === "your-party") {
      return <PlayerParty playerRid={player.playerRid} />;
    }

    if (currentView === "leaderboard") {
      return <Leaderboard />;
    }

    if (currentView === "game-modifiers") {
      return <AllGameModifiers />;
    }

    if (currentView === "messages") {
      return <Messages />;
    }

    if (currentView === "staffers-ladders") {
      return <StafferLadders />;
    }
  };

  const changeCurrentView = (newView: ICurrentView) => () => setCurrentView(newView);

  if (fullGameState.gameState.state === "complete") {
    return (
      <div className={styles.endGameContainer}>
        <div className={styles.results}>Results</div>
        <Leaderboard />
      </div>
    );
  }

  return (
    <div className={styles.activeGameContainer}>
      <div className={styles.menu}>
        <Menu>
          <MenuButton>
            <HamburgerIcon fontSize="20px" />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={changeCurrentView("active-resolution")}>Active resolution</MenuItem>
            <MenuItem onClick={changeCurrentView("your-party")}>Your party</MenuItem>
            <MenuItem onClick={changeCurrentView("messages")}>Messages</MenuItem>
            <MenuDivider />
            <MenuItem onClick={changeCurrentView("leaderboard")}>Leaderboard</MenuItem>
            <MenuItem onClick={changeCurrentView("game-modifiers")}>Game modifiers</MenuItem>
            <MenuDivider />
            <MenuItem onClick={changeCurrentView("staffers-ladders")}>Staffer ladders</MenuItem>
            <MenuDivider />
            {renderPauseOrResumeButton()}
          </MenuList>
        </Menu>
        <div className={styles.quickSelection}>
          <div className={styles.vote} onClick={changeCurrentView("active-resolution")}>
            <div>Vote</div>
            <div className={styles.number}>{notification.voting}</div>
            {notification.voting > 0 && <div className={styles.hasActions} />}
          </div>
          <div className={styles.support} onClick={changeCurrentView("your-party")}>
            <div>Party</div>
            <div className={styles.number}>{notification.hiring + notification.training}</div>
            {notification.hiring + notification.training > 0 && <div className={styles.hasActions} />}
          </div>
        </div>
      </div>
      <div className={styles.title}>{renderCurrentViewTitle()}</div>
      {renderCurrentView()}
      <NotificationsModal />
    </div>
  );
};

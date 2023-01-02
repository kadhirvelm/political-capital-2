/**
 * Copyright (c) 2022 - KM
 */

import { HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { ActiveGameFrontend, IGameState } from "@pc2/api";
import * as React from "react";
import { getUnusedCapacity } from "../../selectors/staffers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import styles from "./ActiveGame.module.scss";
import { ActiveResolution } from "./ActiveResolution";
import { AllGameModifiers } from "./AllGameModifiers";
import { Leaderboard } from "./Leaderboard";
import { PlayerParty } from "./PlayerParty";
import { StafferLadders } from "./StafferLadders";

type ICurrentView = "active-resolution" | "your-party" | "leaderboard" | "game-modifiers" | "staffers-ladders";

export const ActiveGame: React.FC<{}> = () => {
    const [currentView, setCurrentView] = React.useState<ICurrentView>("active-resolution");

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const notification = usePoliticalCapitalSelector(getUnusedCapacity);

    if (player === undefined || fullGameState === undefined) {
        return null;
    }

    const onChangeState = (newState: IGameState["state"]) => () =>
        ActiveGameFrontend.changeActiveGameState({ gameStateRid: fullGameState.gameState.gameStateRid, newState });

    const renderPauseOrResumeButton = () => {
        if (fullGameState.gameState.state === "active") {
            return (
                <MenuItem onClick={onChangeState("paused")} color="red">
                    Pause game
                </MenuItem>
            );
        }

        return (
            <MenuItem onClick={onChangeState("active")} color="green">
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

        if (currentView === "staffers-ladders") {
            return <StafferLadders />;
        }
    };

    const changeCurrentView = (newView: ICurrentView) => () => setCurrentView(newView);

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
                        <div>Support</div>
                        <div className={styles.number}>{notification.hiring + notification.training}</div>
                        {notification.hiring + notification.training > 0 && <div className={styles.hasActions} />}
                    </div>
                </div>
            </div>
            <div className={styles.title}>{renderCurrentViewTitle()}</div>
            {renderCurrentView()}
        </div>
    );
};

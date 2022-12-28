/**
 * Copyright (c) 2022 - KM
 */

import { HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { ActiveGameFrontend, IGameState } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import styles from "./ActiveGame.module.scss";
import { ActiveResolution } from "./ActiveResolution";
import { EveryoneElse } from "./EveryoneElse";
import { PlayerParty } from "./PlayerParty";

type ICurrentView = "active-resolution" | "your-party" | "everyone-else";

export const ActiveGame: React.FC<{}> = () => {
    const [currentView, setCurrentView] = React.useState<ICurrentView>("active-resolution");

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
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

        return "Everyone else";
    };

    const renderCurrentView = () => {
        if (currentView === "active-resolution") {
            return <ActiveResolution />;
        }

        if (currentView === "your-party") {
            return <PlayerParty playerRid={player.playerRid} />;
        }

        return <EveryoneElse />;
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
                        <MenuItem onClick={changeCurrentView("everyone-else")}>Everyone else</MenuItem>
                        <MenuDivider />
                        {renderPauseOrResumeButton()}
                    </MenuList>
                </Menu>
            </div>
            <div className={styles.title}>{renderCurrentViewTitle()}</div>
            {renderCurrentView()}
        </div>
    );
};

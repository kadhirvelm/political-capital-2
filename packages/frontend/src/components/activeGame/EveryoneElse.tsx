/**
 * Copyright (c) 2022 - KM
 */

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IPlayerRid } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { PlayerParty } from "./PlayerParty";
import styles from "./EveryoneElse.module.scss";

export const EveryoneElse: React.FC<{}> = () => {
    const [viewingPlayerRid, setViewingPlayerRid] = React.useState<IPlayerRid | undefined>(undefined);

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    if (player === undefined || fullGameState === undefined) {
        return null;
    }

    const maybeRenderPlayerParty = () => {
        if (viewingPlayerRid === undefined) {
            return <div className={styles.noneSelected}>Select a player to view their party</div>;
        }

        return <PlayerParty playerRid={viewingPlayerRid} />;
    };

    const viewingPlayer = (() => {
        if (viewingPlayerRid === undefined) {
            return undefined;
        }

        return fullGameState.players[viewingPlayerRid];
    })();

    const viewPlayerParty = (playerRid: IPlayerRid | undefined) => () => setViewingPlayerRid(playerRid);

    return (
        <div>
            <div className={styles.selector}>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} className={styles.selectorButton}>
                        <div className={styles.selectedText}>{viewingPlayer?.name ?? "Select a player"}</div>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={viewPlayerParty(undefined)}>Select a player</MenuItem>
                        {Object.values(fullGameState.players)
                            .filter((p) => p.playerRid !== player.playerRid)
                            .map((p) => (
                                <MenuItem key={p.playerRid} onClick={viewPlayerParty(p.playerRid)}>
                                    {p.name}
                                </MenuItem>
                            ))}
                    </MenuList>
                </Menu>
            </div>
            {maybeRenderPlayerParty()}
        </div>
    );
};

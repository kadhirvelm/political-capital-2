/**
 * Copyright (c) 2022 - KM
 */

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IPlayerRid } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { PlayerParty } from "./PlayerParty";
import styles from "./Leaderboard.module.scss";
import { getLeaderboard } from "../../selectors/leaderboard";
import { PartySummary } from "./PartySummary";
import { roundToHundred } from "../../utility/roundTo";

export const Leaderboard: React.FC<{}> = () => {
    const [viewingPlayerRid, setViewingPlayerRid] = React.useState<IPlayerRid | undefined>(undefined);

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const leaderboard = usePoliticalCapitalSelector(getLeaderboard);

    if (player === undefined || fullGameState === undefined) {
        return null;
    }

    const playerPoliticalParty = fullGameState.activePlayersStaffers[player.playerRid];

    const maybeRenderPlayerParty = () => {
        if (viewingPlayerRid === undefined) {
            return undefined;
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

    const hasPoliticalSpy =
        playerPoliticalParty.find((p) => p.stafferDetails.type === "politicalSpy")?.state === "active";
    const canViewPlayerParties = hasPoliticalSpy || fullGameState.gameState.state === "complete";

    const hasInformationBroker =
        playerPoliticalParty.find((p) => p.stafferDetails.type === "informationBroker")?.state === "active";
    const canViewPoliticalCapital = hasInformationBroker || fullGameState.gameState.state === "complete";

    const maybeRenderExploreParty = () => {
        if (!canViewPlayerParties) {
            return undefined;
        }

        return (
            <>
                <div className={styles.detailedPartyView}>Detailed party view</div>
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
            </>
        );
    };

    return (
        <div className={styles.overallContainer}>
            <div className={styles.leaderboard}>
                <div className={styles.leaderboardTable}>
                    {leaderboard.map((leaderboardPlayer, index) => (
                        <div className={styles.singleRow} key={leaderboardPlayer.player.playerRid}>
                            <div className={styles.details}>
                                <div className={styles.name}>
                                    {index + 1}. {leaderboardPlayer.player.name}
                                    {leaderboardPlayer.player.playerRid === player.playerRid ? (
                                        <div>(you)</div>
                                    ) : undefined}
                                </div>
                                {canViewPoliticalCapital && (
                                    <div>
                                        {roundToHundred(
                                            leaderboardPlayer.activePlayer.politicalCapital,
                                        ).toLocaleString()}{" "}
                                        political capital
                                    </div>
                                )}
                            </div>
                            {canViewPlayerParties && <PartySummary playerRid={leaderboardPlayer.player.playerRid} />}
                        </div>
                    ))}
                </div>
            </div>
            {maybeRenderExploreParty()}
            {maybeRenderPlayerParty()}
        </div>
    );
};

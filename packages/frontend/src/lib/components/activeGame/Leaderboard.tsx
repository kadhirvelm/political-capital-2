/**
 * Copyright (c) 2022 - KM
 */

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IPlayerRid } from "@pc2/api";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { PlayerParty } from "./PlayerParty";
import styles from "./Leaderboard.module.scss";
import { getLeaderboard } from "../../selectors/leaderboard";
import { PartySummary } from "./PartySummary";
import { roundToHundred } from "../../utility/roundTo";
import { PlayerName } from "../common/StafferName";
import { FC, useState } from "react";

export const Leaderboard: FC<{}> = () => {
    const [viewingPlayerRid, setViewingPlayerRid] = useState<IPlayerRid | undefined>(undefined);

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
    const canViewPartyDetails = hasPoliticalSpy || fullGameState.gameState.state === "complete";

    const maybeRenderExploreParty = () => {
        if (fullGameState.gameState.state !== "complete") {
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
                                <div className={styles.playerDetailsContainer}>
                                    <div>
                                        <PlayerName
                                            player={leaderboardPlayer.player}
                                            activePlayer={leaderboardPlayer.activePlayer}
                                        />
                                    </div>
                                    <div className={styles.playerDetails}>
                                        <div className={styles.playerName}>
                                            <div>{index + 1}.</div>
                                            <div>{leaderboardPlayer.player.name}</div>
                                            {leaderboardPlayer.player.playerRid === player.playerRid ? (
                                                <div>(you)</div>
                                            ) : undefined}
                                        </div>
                                        {canViewPartyDetails && (
                                            <div className={styles.politicalCapitalContainer}>
                                                <div className={styles.politicalCapital}>Political capital</div>
                                                {roundToHundred(
                                                    leaderboardPlayer.activePlayer.politicalCapital,
                                                ).toLocaleString()}
                                            </div>
                                        )}
                                        {canViewPartyDetails && (
                                            <PartySummary playerRid={leaderboardPlayer.player.playerRid} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {maybeRenderExploreParty()}
            {maybeRenderPlayerParty()}
        </div>
    );
};

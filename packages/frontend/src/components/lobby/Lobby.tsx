/**
 * Copyright (c) 2022 - KM
 */

import { AvatarGroup, Badge, Button } from "@chakra-ui/react";
import { ActiveGameFrontend, IFullGameState, IPlayer } from "@pc2/api";
import classNames from "classnames";
import { keyBy } from "lodash-es";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { PlayerName, StafferName } from "../common/StafferName";
import styles from "./Lobby.module.scss";

const AllPlayers: React.FC<{ indexedPlayers: { [playerRid: string]: IPlayer }; fullGameState: IFullGameState }> = ({
    indexedPlayers,
    fullGameState,
}) => {
    return (
        <div className={styles.playersContainer}>
            {Object.values(fullGameState.activePlayers).map((activePlayer) => {
                const maybePlayer = indexedPlayers?.[activePlayer.playerRid];
                if (maybePlayer === undefined) {
                    return undefined;
                }

                return (
                    <div
                        className={classNames(styles.singlePlayer, {
                            [styles.ready]: activePlayer.isReady,
                            [styles.notReady]: !activePlayer.isReady,
                        })}
                        key={activePlayer.playerRid}
                    >
                        <div className={styles.playerNameContainer}>
                            <PlayerName player={maybePlayer} activePlayer={activePlayer} />
                        </div>
                        <div className={styles.playerDetails}>
                            <div className={styles.playerNameAndReady}>
                                <div className={styles.playerNameText}>
                                    {indexedPlayers?.[activePlayer.playerRid]?.name}
                                </div>
                                {activePlayer.isReady ? (
                                    <Badge colorScheme="green">Ready</Badge>
                                ) : (
                                    <Badge colorScheme="red">Not ready</Badge>
                                )}
                            </div>
                            <AvatarGroup>
                                {fullGameState.activePlayersStaffers[activePlayer.playerRid].map((staffer) => (
                                    <StafferName staffer={staffer} avatarExclusive key={staffer.activeStafferRid} />
                                ))}
                            </AvatarGroup>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

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

    const maybeRenderCreateNewGameButton = () => {
        if (fullGameState !== undefined) {
            return undefined;
        }

        return (
            <div className={styles.createNewGame}>
                <Button isLoading={isLoading} onClick={onCreateNewGame}>
                    Create new game
                </Button>
            </div>
        );
    };

    const startGame = async () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        setIsLoading(true);
        await ActiveGameFrontend.changeActiveGameState({
            gameStateRid: fullGameState?.gameState.gameStateRid,
            newState: "active",
        });
        setIsLoading(false);
    };

    const maybeRenderPlayerActions = () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        const areAllPlayersReady = Object.values(fullGameState?.activePlayers ?? {}).every((p) => p.isReady);
        const canThisPlayerStart =
            Object.values(fullGameState.activePlayers ?? {})?.slice(-1)[0]?.playerRid === player.playerRid;

        if (!areAllPlayersReady || !canThisPlayerStart) {
            return undefined;
        }

        return (
            <div className={styles.playerActions}>
                <Button colorScheme="green" onClick={startGame}>
                    Start game!
                </Button>
            </div>
        );
    };

    const togglePlayerReady = (currentReadyState: boolean) => async () => {
        if (fullGameState === undefined || player === undefined) {
            return;
        }

        const thisPlayer = fullGameState.activePlayers[player.playerRid];

        setIsLoading(true);
        await ActiveGameFrontend.changeReadyState({
            gameStateRid: fullGameState.gameState.gameStateRid,
            playerRid: player.playerRid,
            isReady: !currentReadyState,
            avatarSet: thisPlayer.avatarSet,
        });
        setIsLoading(false);
    };

    const maybeRenderPlayers = () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        const indexedPlayers = keyBy(fullGameState.players, (p) => p.playerRid);
        const thisPlayer = fullGameState.activePlayers[player.playerRid];

        return (
            <>
                <div>
                    <PlayerName player={player} activePlayer={thisPlayer} />
                    <Button onClick={togglePlayerReady(thisPlayer.isReady)}>
                        {thisPlayer.isReady ? "Unready" : "Ready up"}
                    </Button>
                </div>
                <AllPlayers indexedPlayers={indexedPlayers} fullGameState={fullGameState} />
            </>
        );
    };

    return (
        <div className={styles.lobbyMainContainer}>
            <div className={styles.lobbyText}>Waiting for game to start</div>
            {maybeRenderCreateNewGameButton()}
            {maybeRenderPlayerActions()}
            {maybeRenderPlayers()}
        </div>
    );
};

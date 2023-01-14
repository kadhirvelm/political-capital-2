/**
 * Copyright (c) 2022 - KM
 */

import { AvatarGroup, Badge, Button, Input } from "@chakra-ui/react";
import { ActiveGameFrontend, IFullGameState, IPlayer, PlayerServiceFrontend } from "@pc2/api";
import classNames from "classnames";
import { keyBy } from "lodash-es";
import * as React from "react";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { setPlayer } from "../../store/playerState";
import { PlayerName, StafferName } from "../common/StafferName";
import styles from "./Lobby.module.scss";

const getStartingPlayerRid = (activePlayers: IFullGameState["activePlayers"] | undefined) =>
    Object.values(activePlayers ?? {})?.slice(-1)[0]?.playerRid;

const ThisPlayer: React.FC<{ fullGameState: IFullGameState }> = ({ fullGameState }) => {
    const dispatch = usePoliticalCapitalDispatch();

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);

    const [playerName, setPlayerName] = React.useState(player?.name);
    const [isLoading, setIsLoading] = React.useState(false);

    if (player === undefined) {
        return null;
    }

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

    const onChangePlayerName = (event: React.ChangeEvent<HTMLInputElement>) => setPlayerName(event.currentTarget.value);
    const savePlayerName = () => {
        const updatedPlayer: IPlayer = { ...player, name: playerName || player.name };
        PlayerServiceFrontend.updatePlayer(updatedPlayer);

        dispatch(setPlayer(updatedPlayer));
    };

    const thisPlayer = fullGameState.activePlayers[player.playerRid];

    return (
        <div className={styles.thisPlayerContainer}>
            <div>
                <PlayerName player={player} activePlayer={thisPlayer} />
            </div>
            <div>
                <div>
                    <Input value={playerName} onChange={onChangePlayerName} onBlur={savePlayerName} />
                </div>
                <Button onClick={togglePlayerReady(thisPlayer.isReady)} isLoading={isLoading}>
                    {thisPlayer.isReady ? "Unready" : "Ready up"}
                </Button>
            </div>
        </div>
    );
};

const AllPlayers: React.FC<{ fullGameState: IFullGameState }> = ({ fullGameState }) => {
    const startingPlayerRid = getStartingPlayerRid(fullGameState.activePlayers);
    const indexedPlayers = keyBy(fullGameState.players, (p) => p.playerRid);

    return (
        <div className={styles.playersContainer}>
            {Object.values(fullGameState.activePlayers).map((activePlayer) => {
                const maybePlayer = indexedPlayers?.[activePlayer.playerRid];
                if (maybePlayer === undefined) {
                    return undefined;
                }

                const renderBadge = () => {
                    if (!activePlayer.isReady) {
                        return <Badge colorScheme="red">Not ready</Badge>;
                    }

                    if (activePlayer.isReady && startingPlayerRid === maybePlayer.playerRid) {
                        return <Badge colorScheme="blue">Host</Badge>;
                    }

                    return <Badge colorScheme="green">Ready</Badge>;
                };

                return (
                    <div
                        className={classNames(styles.singlePlayer, {
                            [styles.ready]: activePlayer.isReady && startingPlayerRid !== maybePlayer.playerRid,
                            [styles.notReady]: !activePlayer.isReady,
                            [styles.canStart]: activePlayer.isReady && startingPlayerRid === maybePlayer.playerRid,
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
                                {renderBadge()}
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
        const canThisPlayerStart = getStartingPlayerRid(fullGameState.activePlayers) === player.playerRid;

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

    const maybeRenderPlayers = () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        return (
            <>
                <ThisPlayer fullGameState={fullGameState} />
                <div className={styles.allPlayersText}>All players</div>
                <AllPlayers fullGameState={fullGameState} />
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

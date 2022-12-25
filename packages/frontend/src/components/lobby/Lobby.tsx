/**
 * Copyright (c) 2022 - KM
 */

import { CheckIcon, CloseIcon, TimeIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { ActiveGameFrontend } from "@pc2/api";
import classNames from "classnames";
import { keyBy } from "lodash-es";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import styles from "./Lobby.module.scss";

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

    const changePlayerReady = (isReady: boolean) => async () => {
        if (fullGameState === undefined || player === undefined) {
            return;
        }

        setIsLoading(true);
        await ActiveGameFrontend.changeReadyState({
            gameStateRid: fullGameState.gameState.gameStateRid,
            playerRid: player.playerRid,
            isReady,
        });
        setIsLoading(false);
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

    const maybeRenderStartGame = () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        const areAllPlayersReady = fullGameState?.activePlayers.every((p) => p.isReady);
        const canThisPlayerStart = fullGameState.activePlayers[0].playerRid === player.playerRid;

        if (!areAllPlayersReady || !canThisPlayerStart) {
            return undefined;
        }

        return (
            <div>
                <Button colorScheme="green" onClick={startGame}>
                    Start game!
                </Button>
            </div>
        );
    };

    const maybeRenderPlayerActions = () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        const thisPlayer = fullGameState.activePlayers.find((p) => p.playerRid === player.playerRid);

        return (
            <div className={styles.playerActions}>
                <div>
                    {thisPlayer?.isReady ? (
                        <Button colorScheme="red" isLoading={isLoading} onClick={changePlayerReady(false)}>
                            Not ready
                        </Button>
                    ) : (
                        <Button colorScheme="green" isLoading={isLoading} onClick={changePlayerReady(true)}>
                            Ready
                        </Button>
                    )}
                </div>
                {maybeRenderStartGame()}
            </div>
        );
    };

    const maybeRenderPlayers = () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        const indexedPlayers = keyBy(fullGameState.players, (p) => p.playerRid);

        return (
            <>
                <div className={styles.tableHeaders}>
                    <div className={styles.name}>Name</div>
                    <div className={styles.politicalCapital}>PC</div>
                    <div className={styles.staffers}>Staffers</div>
                </div>
                <div className={styles.playersContainer}>
                    {fullGameState.activePlayers.map((activePlayer) => (
                        <div className={styles.singlePlayer} key={activePlayer.playerRid}>
                            <div
                                className={classNames(styles.isReady, {
                                    [styles.ready]: activePlayer.isReady,
                                    [styles.notReady]: !activePlayer.isReady,
                                })}
                            >
                                {activePlayer.isReady ? <CheckIcon /> : <CloseIcon />}
                            </div>
                            <div className={styles.name}>
                                {indexedPlayers[activePlayer.playerRid].name}
                                {activePlayer.playerRid === player.playerRid && " (you)"}
                            </div>
                            <div className={styles.politicalCapital}>{activePlayer.politicalCapital}</div>
                            <div className={styles.staffers}>Unknown</div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className={styles.lobbyMainContainer}>
            <div className={styles.lobbyText}>
                <span>Lobby</span>
                <TimeIcon />
            </div>
            {maybeRenderCreateNewGameButton()}
            {maybeRenderPlayerActions()}
            {maybeRenderPlayers()}
        </div>
    );
};

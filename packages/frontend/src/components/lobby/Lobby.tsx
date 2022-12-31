/**
 * Copyright (c) 2022 - KM
 */

import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { ActiveGameFrontend } from "@pc2/api";
import classNames from "classnames";
import { keyBy } from "lodash-es";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { StafferCard } from "../common/StafferCard";
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

        const areAllPlayersReady = Object.values(fullGameState?.activePlayers ?? {}).every((p) => p.isReady);
        const canThisPlayerStart =
            Object.values(fullGameState.activePlayers ?? {})?.[0]?.playerRid === player.playerRid;

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

        return <div className={styles.playerActions}>{maybeRenderStartGame()}</div>;
    };

    const maybeRenderPlayers = () => {
        if (fullGameState === undefined) {
            return undefined;
        }

        const indexedPlayers = keyBy(fullGameState.players, (p) => p.playerRid);
        const thisPlayer = fullGameState.activePlayers[player.playerRid];

        return (
            <>
                <div className={styles.tableHeaders}>
                    <div className={styles.name}>Name</div>
                    <div className={styles.staffers}>Staffers</div>
                </div>
                <div className={styles.playersContainer}>
                    {Object.values(fullGameState.activePlayers).map((activePlayer) => {
                        return (
                            <div className={styles.singlePlayer} key={activePlayer.playerRid}>
                                <div
                                    className={classNames(styles.isReady, {
                                        [styles.ready]: activePlayer.isReady,
                                        [styles.notReady]: !activePlayer.isReady,
                                    })}
                                >
                                    <div>{activePlayer.isReady ? <CheckIcon /> : <CloseIcon />}</div>
                                </div>
                                <div className={styles.name}>
                                    <div>
                                        {indexedPlayers[activePlayer.playerRid].name}
                                        {activePlayer.playerRid === player.playerRid && " (you)"}
                                    </div>
                                    {player.playerRid === activePlayer.playerRid && (
                                        <div className={styles.readyUpContainer}>
                                            {thisPlayer?.isReady ? (
                                                <Button
                                                    colorScheme="red"
                                                    isLoading={isLoading}
                                                    onClick={changePlayerReady(false)}
                                                >
                                                    Unready
                                                </Button>
                                            ) : (
                                                <Button
                                                    colorScheme="green"
                                                    isLoading={isLoading}
                                                    onClick={changePlayerReady(true)}
                                                >
                                                    Ready up
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.staffers}>
                                    {fullGameState.activePlayersStaffers[activePlayer.playerRid]
                                        .slice()
                                        .sort((a, b) => a.stafferDetails.type.localeCompare(b.stafferDetails.type))
                                        .map((staffer) => (
                                            <StafferCard staffer={staffer} key={staffer.activeStafferRid} />
                                        ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
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

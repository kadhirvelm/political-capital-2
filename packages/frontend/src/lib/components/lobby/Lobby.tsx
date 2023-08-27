/*
 * Copyright 2023 KM.
 */

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { AvatarGroup, Badge, Button, Input } from "@chakra-ui/react";
import {
  ActiveGameFrontend,
  AvatarSet,
  type IActiveGameService,
  type IFullGameState,
  type IPlayer,
  PlayerServiceFrontend,
} from "@pc2/api";
import classNames from "classnames";
import { keyBy } from "lodash-es";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { setPlayer } from "../../store/playerState";
import { PlayerName, StafferName } from "../common/StafferName";
import styles from "./Lobby.module.scss";
import { type FC, useState, type ChangeEvent } from "react";

const getStartingPlayerRid = (activePlayers: IFullGameState["activePlayers"] | undefined) =>
  Object.values(activePlayers ?? {})?.slice(-1)[0]?.playerRid;

const ThisPlayer: FC<{ fullGameState: IFullGameState }> = ({ fullGameState }) => {
  const dispatch = usePoliticalCapitalDispatch();

  const player = usePoliticalCapitalSelector((s) => s.playerState.player);

  const [playerName, setPlayerName] = useState(player?.name);
  const [isLoading, setIsLoading] = useState(false);

  if (player === undefined) {
    return null;
  }

  const thisPlayer = fullGameState.activePlayers[player.playerRid];

  const updatePlayer = async (newReadyState: Partial<IActiveGameService["changeReadyState"]["payload"]>) => {
    setIsLoading(true);
    await ActiveGameFrontend.changeReadyState({
      avatarSet: newReadyState.avatarSet ?? thisPlayer.avatarSet,
      gameStateRid: fullGameState.gameState.gameStateRid,
      isReady: newReadyState.isReady ?? thisPlayer.isReady,
      playerRid: player.playerRid,
    });
    setIsLoading(false);
  };

  const onChangeAvatarSet = (direction: "left" | "right") => () => {
    const currentIcon = AvatarSet.indexOf(thisPlayer.avatarSet);

    const newAvatarIndex = (() => {
      const naiveNumber = currentIcon + (direction === "left" ? -1 : 1);

      if (naiveNumber < 0) {
        return AvatarSet.length - 1;
      }

      if (naiveNumber > AvatarSet.length - 1) {
        return 0;
      }

      return naiveNumber;
    })();

    updatePlayer({ avatarSet: AvatarSet[newAvatarIndex] });
  };

  const onChangePlayerName = (event: ChangeEvent<HTMLInputElement>) => setPlayerName(event.currentTarget.value);
  const savePlayerName = () => {
    const updatedPlayer: IPlayer = { ...player, name: playerName || player.name };
    PlayerServiceFrontend.updatePlayer(updatedPlayer);

    dispatch(setPlayer(updatedPlayer));
  };

  const togglePlayerReady = () => {
    if (fullGameState === undefined || player === undefined) {
      return;
    }

    updatePlayer({ isReady: !thisPlayer.isReady });
  };

  const { isReady } = thisPlayer;

  return (
    <div className={styles.thisPlayerContainer}>
      <div className={styles.playerNameContainer}>
        {isReady ? (
          <div className={styles.dummyChevron} />
        ) : (
          <ChevronLeftIcon boxSize={7} onClick={onChangeAvatarSet("left")} />
        )}
        <PlayerName activePlayer={thisPlayer} player={player} />
        {isReady ? (
          <div className={styles.dummyChevron} />
        ) : (
          <ChevronRightIcon boxSize={7} onClick={onChangeAvatarSet("right")} />
        )}
      </div>
      <div className={styles.playerDetails}>
        <div className={styles.playerNameAndReady}>
          {isReady ? (
            <div className={styles.playerNameText}>{playerName}</div>
          ) : (
            <Input background="white" onBlur={savePlayerName} onChange={onChangePlayerName} value={playerName} />
          )}
        </div>
        <Button colorScheme={thisPlayer.isReady ? "red" : "green"} isLoading={isLoading} onClick={togglePlayerReady}>
          {thisPlayer.isReady ? "Unready" : "Ready up"}
        </Button>
      </div>
    </div>
  );
};

const AllPlayers: FC<{ fullGameState: IFullGameState }> = ({ fullGameState }) => {
  const startingPlayerRid = getStartingPlayerRid(fullGameState.activePlayers);
  const indexedPlayers = keyBy(fullGameState.players, (p) => p.playerRid);

  return (
    <div className={styles.playersContainer}>
      {Object.values(fullGameState.activePlayers).map((activePlayer) => {
        const maybePlayer = indexedPlayers?.[activePlayer.playerRid];
        if (maybePlayer === undefined) {
          return;
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
              <PlayerName activePlayer={activePlayer} player={maybePlayer} />
            </div>
            <div className={styles.playerDetails}>
              <div className={styles.playerNameAndReady}>
                <div className={styles.playerNameText}>{indexedPlayers?.[activePlayer.playerRid]?.name}</div>
                {renderBadge()}
              </div>
              <AvatarGroup>
                {fullGameState.activePlayersStaffers[activePlayer.playerRid].map((staffer) => (
                  <StafferName avatarExclusive key={staffer.activeStafferRid} staffer={staffer} />
                ))}
              </AvatarGroup>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Lobby: FC<{}> = () => {
  const player = usePoliticalCapitalSelector((s) => s.playerState.player);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

  const [isLoading, setIsLoading] = useState(false);

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
      return;
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
      return;
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
      return;
    }

    const areAllPlayersReady = Object.values(fullGameState?.activePlayers ?? {}).every((p) => p.isReady);
    const canThisPlayerStart = getStartingPlayerRid(fullGameState.activePlayers) === player.playerRid;

    if (!areAllPlayersReady || !canThisPlayerStart) {
      return;
    }

    return (
      <div className={styles.playerActions}>
        <Button colorScheme="green" onClick={startGame} style={{ display: "flex", flex: "1" }}>
          Start game!
        </Button>
      </div>
    );
  };

  const maybeRenderPlayers = () => {
    if (fullGameState === undefined) {
      return;
    }

    return (
      <>
        <ThisPlayer fullGameState={fullGameState} />
        <div className={styles.allPlayersText}>
          <div>All players</div>
          <div className={styles.divider} />
        </div>
        <AllPlayers fullGameState={fullGameState} />
      </>
    );
  };

  return (
    <div className={styles.lobbyMainContainer}>
      <div className={styles.pc2}>Political Capital 2</div>
      {maybeRenderCreateNewGameButton()}
      {maybeRenderPlayerActions()}
      {maybeRenderPlayers()}
    </div>
  );
};

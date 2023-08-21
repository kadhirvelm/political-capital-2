/*
 * Copyright 2023 KM.
 */

import {
  type IActiveResolutionRid,
  type IActiveResolutionVote,
  type IActiveStaffer,
  type IFullGameState,
  type IPlayer,
  isVoter,
} from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { type State } from "../store/createStore";
import { type IUserFacingIndexedResolveEvents, type IUserFacingResolveEvents } from "../store/gameState";
import { getGameModifiers, type IResolvedGameModifiersForEachStaffer } from "./gameModifiers";

export interface IVoterAndActiveEvent {
  activeEvent: IUserFacingResolveEvents | undefined;
  staffer: IActiveStaffer;
}

export const getVoters = createSelector(
  getGameModifiers,
  (state: State) => state.playerState.player,
  (state: State) => state.localGameState.fullGameState?.activePlayersStaffers,
  (state: State) => state.localGameState.resolveEvents,
  (state: State) => state.localGameState.fullGameState,
  (
    gameModifiers: IResolvedGameModifiersForEachStaffer,
    playerState: IPlayer | undefined,
    activePlayersStaffers: IFullGameState["activePlayersStaffers"] | undefined,
    resolveEvent: IUserFacingIndexedResolveEvents | undefined,
    gameState: IFullGameState | undefined,
  ): IVoterAndActiveEvent[] => {
    if (playerState === undefined || activePlayersStaffers === undefined || resolveEvent === undefined) {
      return [];
    }

    return activePlayersStaffers[playerState.playerRid]
      .filter((staffer) => {
        return isVoter(staffer.stafferDetails);
      })
      .map((staffer) => ({
        activeEvent: resolveEvent.players[playerState.playerRid]?.staffers[staffer.activeStafferRid]?.find(
          (event) => event.state === "active" && (gameState?.gameState.gameClock ?? 0) < event.resolvesOn,
        ),
        staffer,
      }))
      .sort((a, b) => {
        if (a.staffer.state !== b.staffer.state) {
          return a.staffer.state.localeCompare(b.staffer.state);
        }

        const aVotes = gameModifiers[a.staffer.stafferDetails.type].effectiveness;
        const bVotes = gameModifiers[b.staffer.stafferDetails.type].effectiveness;

        if (aVotes === bVotes) {
          return a.staffer.stafferDetails.displayName.localeCompare(b.staffer.stafferDetails.displayName);
        }

        return aVotes > bVotes ? -1 : 1;
      });
  },
);

export const getVotesAlreadyCast = (activeResolutionRid: IActiveResolutionRid | undefined) =>
  createSelector(
    getVoters,
    (state: State) => state.localGameState.fullGameState,
    (playerVoters: IVoterAndActiveEvent[], fullGameState: IFullGameState | undefined) => {
      if (fullGameState === undefined || activeResolutionRid === undefined) {
        return [];
      }

      const alreadyCastVotes: IActiveResolutionVote[] = [];
      for (const playerVoter of playerVoters) {
        alreadyCastVotes.push(
          ...(fullGameState.activePlayersVotes[activeResolutionRid]?.[playerVoter.staffer.activeStafferRid] ?? []),
        );
      }

      return alreadyCastVotes;
    },
  );

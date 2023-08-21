/*
 * Copyright 2023 KM.
 */

import {
  type IActiveStaffer,
  type IActiveStafferRid,
  IEvent,
  type IFullGameState,
  type IPlayer,
  isRecruit,
  isTrainer,
  isVoter,
  StafferLadderIndex,
} from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { type State } from "../store/createStore";
import { type IUserFacingIndexedResolveEvents } from "../store/gameState";
import { getGameModifiers, type IResolvedGameModifiersForEachStaffer } from "./gameModifiers";

export const getAvailableToTrainStaffer = (trainerRid: IActiveStafferRid) =>
  createSelector(
    (state: State) => state.localGameState.fullGameState,
    (state: State) => state.localGameState.resolveEvents,
    (state: State) => state.playerState.player,
    (
      fullGameState: IFullGameState | undefined,
      resolveEvents: IUserFacingIndexedResolveEvents | undefined,
      player: IPlayer | undefined,
    ) => {
      if (fullGameState === undefined || resolveEvents === undefined || player === undefined) {
        return [];
      }

      const hasStafferVoted = (votingStaffer: IActiveStaffer) => {
        if (!isVoter(votingStaffer)) {
          return false;
        }

        const maybeActiveResolution = fullGameState.activeResolutions.find(
          (resolution) => resolution.state === "active",
        );
        if (maybeActiveResolution === undefined) {
          return false;
        }

        const maybeVotes =
          fullGameState.activePlayersVotes[maybeActiveResolution.activeResolutionRid]?.[
            votingStaffer.activeStafferRid
          ] ?? [];
        return maybeVotes.length > 0;
      };

      return fullGameState.activePlayersStaffers[player.playerRid].filter((staffer) => {
        const isNotSelf = staffer.activeStafferRid !== trainerRid;
        const isNotBusy =
          (resolveEvents.players[player.playerRid]?.staffers[staffer.activeStafferRid]?.filter(
            (event) => event.state === "active" || event.state === "pending",
          )?.length ?? 0) === 0;
        const hasUpgrades = (StafferLadderIndex[staffer.stafferDetails.type] ?? []).length > 0;
        const hasVoted = hasStafferVoted(staffer);

        return isNotSelf && isNotBusy && hasUpgrades && staffer.state === "active" && !hasVoted;
      });
    },
  );

export const getUnusedCapacity = createSelector(
  getGameModifiers,
  (state: State) => state.localGameState.fullGameState,
  (state: State) => state.localGameState.resolveEvents,
  (state: State) => state.playerState.player,
  (
    gameModifiers: IResolvedGameModifiersForEachStaffer,
    fullGameState: IFullGameState | undefined,
    resolveEvents: IUserFacingIndexedResolveEvents | undefined,
    player: IPlayer | undefined,
  ): { hiring: number; training: number; voting: number } => {
    const notifications = { hiring: 0, training: 0, voting: 0 };

    if (fullGameState === undefined || resolveEvents === undefined || player === undefined) {
      return notifications;
    }

    const currentResolution = fullGameState.activeResolutions.find((resolution) => resolution.state === "active");

    for (const staffer of fullGameState.activePlayersStaffers[player.playerRid]) {
      if (isVoter(staffer) && currentResolution !== undefined && staffer.state !== "disabled") {
        const totalVotes = gameModifiers[staffer.stafferDetails.type].effectiveness;
        const castVotes =
          fullGameState.activePlayersVotes[currentResolution.activeResolutionRid]?.[staffer.activeStafferRid]?.length ??
          0;

        // The Math.max should handle the independent voters without needing a special case
        notifications.voting += Math.max(totalVotes - castVotes, 0);
      }

      if (isRecruit(staffer) && staffer.state !== "disabled") {
        const totalRecruitCapacity = gameModifiers[staffer.stafferDetails.type].effectiveness;
        const currentlyRecruiting =
          resolveEvents.players[player.playerRid]?.staffers[staffer.activeStafferRid]?.filter(
            (event) =>
              (event.state === "active" || event.state === "pending") &&
              (IEvent.isStartHireStaffer(event.eventDetails) || IEvent.isFinishHiringStaffer(event.eventDetails)),
          ).length ?? 0;

        notifications.hiring += Math.max(totalRecruitCapacity - currentlyRecruiting, 0);
      }

      if (isTrainer(staffer) && staffer.state !== "disabled") {
        const totalTrainingCapacity = gameModifiers[staffer.stafferDetails.type].effectiveness;
        const currentlyTraining =
          resolveEvents.players[player.playerRid]?.staffers[staffer.activeStafferRid]?.filter(
            (event) =>
              (event.state === "active" || event.state === "pending") &&
              (IEvent.isStartTrainingStaffer(event.eventDetails) || IEvent.isFinishTrainingStaffer(event.eventDetails)),
          ).length ?? 0;

        notifications.training += Math.max(totalTrainingCapacity - currentlyTraining, 0);
      }
    }

    return notifications;
  },
);

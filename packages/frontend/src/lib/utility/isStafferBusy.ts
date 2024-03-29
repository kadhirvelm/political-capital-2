/*
 * Copyright 2023 KM.
 */

import {
  type IActiveResolution,
  type IActiveStaffer,
  IEvent,
  type IFullGameState,
  type IPlayerRid,
  isRecruit,
  isTrainer,
  isVoter,
} from "@pc2/api";
import { type IResolvedGameModifiersForEachStaffer } from "../selectors/gameModifiers";
import { type IUserFacingIndexedResolveEvents } from "../store/gameState";

export function isStafferBusy(
  staffer: IActiveStaffer,
  resolveEvents: IUserFacingIndexedResolveEvents | undefined,
  playerRid: IPlayerRid | undefined,
  fullGameState: IFullGameState | undefined,
  activeResolution: IActiveResolution | undefined,
  gameModifiers: IResolvedGameModifiersForEachStaffer,
): boolean {
  if (playerRid === undefined) {
    return false;
  }

  if (staffer.state === "disabled") {
    return true;
  }

  const activeEvents =
    resolveEvents?.players[playerRid]?.staffers[staffer.activeStafferRid]?.filter(
      (event) => event.state === "active" || event.state === "pending",
    ) ?? [];

  const hasActiveEvent = activeEvents.length > 0;

  if (isRecruit(staffer) || isTrainer(staffer)) {
    const totalEffectiveness = gameModifiers[staffer.stafferDetails.type].effectiveness;
    const relevantActiveEvents = activeEvents.filter(
      (event) =>
        IEvent.isStartHireStaffer(event.eventDetails) ||
        IEvent.isFinishHiringStaffer(event.eventDetails) ||
        IEvent.isStartTrainingStaffer(event.eventDetails) ||
        IEvent.isFinishTrainingStaffer(event.eventDetails),
    );

    return totalEffectiveness <= relevantActiveEvents.length;
  }

  if (isVoter(staffer) && fullGameState !== undefined && activeResolution !== undefined) {
    const totalAllowedVotes = gameModifiers[staffer.stafferDetails.type].effectiveness;
    const maybeVotesOnThisResolution =
      fullGameState.activePlayersVotes[activeResolution.activeResolutionRid]?.[staffer.activeStafferRid];

    return totalAllowedVotes <= (maybeVotesOnThisResolution?.length ?? 0);
  }

  return hasActiveEvent;
}

/*
 * Copyright 2023 KM.
 */

import { DEFAULT_STAFFER, type IAllStaffers, IEvent, type IFullGameState, type IPlayerRid } from "@pc2/api";
import { flatten } from "lodash-es";

export function doesExceedLimit(
  stafferType: Exclude<keyof IAllStaffers, "unknown">,
  playerRid: IPlayerRid,
  fullGameState: IFullGameState,
  type: "recruiting" | "training",
) {
  const maybeLimitPerParty = DEFAULT_STAFFER[stafferType].limitPerParty;
  if (maybeLimitPerParty === undefined) {
    return false;
  }

  const existingStaffers = fullGameState.activePlayersStaffers[playerRid].filter(
    (s) => s.stafferDetails.type === stafferType,
  );

  const overallExistingGameEvents = fullGameState.resolveEvents.players[playerRid]?.overall ?? [];
  const existingGameEventsForStaffers = flatten(
    Object.values(fullGameState.resolveEvents.players[playerRid]?.staffers ?? {}),
  );
  const existingRequestsForStafferInEvents = [...overallExistingGameEvents, ...existingGameEventsForStaffers].filter(
    (event) => {
      if (type === "recruiting") {
        return (
          IEvent.isStartHireStaffer(event.eventDetails) &&
          event.eventDetails.stafferType === stafferType &&
          event.resolvesOn > fullGameState.gameState.gameClock
        );
      }

      return (
        IEvent.isStartTrainingStaffer(event.eventDetails) &&
        event.eventDetails.toLevel === stafferType &&
        event.resolvesOn > fullGameState.gameState.gameClock
      );
    },
  );

  return existingStaffers.length + existingRequestsForStafferInEvents.length >= maybeLimitPerParty;
}

/**
 * Copyright (c) 2023 - KM
 */

import { DEFAULT_STAFFER, IAllStaffers, IFullGameState, IPlayerRid } from "@pc2/api";
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
    const existingRequestsForStafferInEvents = overallExistingGameEvents
        .concat(existingGameEventsForStaffers)
        .filter((event) => {
            if (type === "recruiting") {
                return (
                    event.eventDetails.type === "start-hiring-staffer" && event.eventDetails.stafferType === stafferType
                );
            }

            return event.eventDetails.type === "start-training-staffer" && event.eventDetails.toLevel === stafferType;
        });

    return existingStaffers.length + existingRequestsForStafferInEvents.length >= maybeLimitPerParty;
}

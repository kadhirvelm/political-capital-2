/**
 * Copyright (c) 2022 - KM
 */

import {
    IActiveResolutionRid,
    IActiveResolutionVote,
    IActiveStaffer,
    IFullGameState,
    IPlayer,
    isVoter,
} from "@pc2/api";
import { createSelector } from "@reduxjs/toolkit";
import { State } from "../store/createStore";
import { IUserFacingIndexedResolveEvents, IUserFacingResolveEvents } from "../store/gameState";
import { getEffectivenessNumber } from "../utility/stafferDescriptions";
import { getGameModifiers, IResolvedGameModifiers } from "./gameModifiers";

export interface IVoterAndActiveEvent {
    staffer: IActiveStaffer;
    activeEvent: IUserFacingResolveEvents | undefined;
}

export const getVoters = createSelector(
    getGameModifiers,
    (state: State) => state.playerState.player,
    (state: State) => state.localGameState.fullGameState?.activePlayersStaffers,
    (state: State) => state.localGameState.resolveEvents,
    (
        gameModifiers: IResolvedGameModifiers,
        playerState: IPlayer | undefined,
        activePlayersStaffers: IFullGameState["activePlayersStaffers"] | undefined,
        resolveEvent: IUserFacingIndexedResolveEvents | undefined,
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
                    (event) => event.state === "active",
                ),
                staffer,
            }))
            .slice()
            .sort((a, b) => {
                if (a.staffer.state !== b.staffer.state) {
                    return a.staffer.state.localeCompare(b.staffer.state);
                }

                const aVotes = getEffectivenessNumber(gameModifiers, a.staffer.stafferDetails.type);
                const bVotes = getEffectivenessNumber(gameModifiers, b.staffer.stafferDetails.type);

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
            playerVoters.forEach((playerVoter) => {
                alreadyCastVotes.push(
                    ...(fullGameState.activePlayersVotes[activeResolutionRid]?.[playerVoter.staffer.activeStafferRid] ??
                        []),
                );
            });

            return alreadyCastVotes;
        },
    );

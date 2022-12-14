/**
 * Copyright (c) 2022 - KM
 */

import {
    IActiveResolutionVote,
    IActiveStafferRid,
    IFullGameState,
    IPartialResolveGameEvent,
    IPlayerRid,
    IPossibleEvent,
    IPossibleToPlayerMessages,
    IResolveGameEvent,
    IToPlayerMessages,
} from "@pc2/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IUserFacingResolveEvents = IResolveGameEvent | IPartialResolveGameEvent<IPossibleEvent>;

export const isResolveGameEvent = (event: IUserFacingResolveEvents): event is IResolveGameEvent => {
    return (event as IResolveGameEvent).resolvesOn !== undefined && event.state !== "pending";
};

export interface IUserFacingIndexedResolveEvents {
    game: IResolveGameEvent[];
    players: {
        [playerRid: IPlayerRid]: {
            overall: IResolveGameEvent[];
            staffers: {
                [stafferRid: IActiveStafferRid]: IUserFacingResolveEvents[];
            };
        };
    };
}

export interface ILocalGameState {
    fullGameState: IFullGameState | undefined;
    resolveEvents: IUserFacingIndexedResolveEvents | undefined;
}

const initialState: ILocalGameState = {
    fullGameState: undefined,
    resolveEvents: undefined,
};

const gameState = createSlice({
    name: "gameState",
    initialState,
    reducers: {
        handleGameMessage: (state, action: PayloadAction<IPossibleToPlayerMessages>) => {
            IToPlayerMessages.visit(action.payload, {
                updateGameState: ({ newGameState }) => {
                    state.fullGameState = newGameState;
                    state.resolveEvents = newGameState.resolveEvents;
                },
                unknown: () => {},
            });
        },
        addGameEventToStaffer: (
            state,
            action: PayloadAction<{
                playerRid: IPlayerRid;
                activeStafferRid: IActiveStafferRid;
                resolveGameEvent: IPartialResolveGameEvent<IPossibleEvent>;
            }>,
        ) => {
            if (state.resolveEvents === undefined) {
                return state;
            }

            const { playerRid, activeStafferRid, resolveGameEvent } = action.payload;
            state.resolveEvents.players[playerRid] = {
                overall: state.resolveEvents.players[playerRid]?.overall ?? [],
                staffers: state.resolveEvents.players[playerRid]?.staffers ?? {},
            };
            state.resolveEvents.players[playerRid].staffers[activeStafferRid] =
                (state.resolveEvents.players[playerRid].staffers[activeStafferRid] ?? []).slice() ?? [];

            // We need to get the reference to change at this level
            state.resolveEvents.players[playerRid].staffers[activeStafferRid] =
                state.resolveEvents.players[playerRid].staffers[activeStafferRid].concat(resolveGameEvent);
        },
        addVotes: (state, action: PayloadAction<IActiveResolutionVote[]>) => {
            if (state.fullGameState === undefined) {
                return state;
            }

            action.payload.forEach((vote) => {
                state.fullGameState!.activePlayersVotes[vote.activeResolutionRid] =
                    state.fullGameState?.activePlayersVotes[vote.activeResolutionRid] ?? {};
                state.fullGameState!.activePlayersVotes[vote.activeResolutionRid][vote.activeStafferRid] =
                    state.fullGameState!.activePlayersVotes[vote.activeResolutionRid][vote.activeStafferRid] ?? [];

                state.fullGameState!.activePlayersVotes[vote.activeResolutionRid][vote.activeStafferRid].push(vote);
            });
        },
        payPoliticalCapital: (state, action: PayloadAction<{ cost: number; playerRid: IPlayerRid }>) => {
            if (state.fullGameState === undefined) {
                return state;
            }

            state.fullGameState.activePlayers[action.payload.playerRid].politicalCapital -= action.payload.cost;
        },
        setGameState: (state, action: PayloadAction<IFullGameState>) => {
            state.fullGameState = action.payload;
        },
    },
});

export const { handleGameMessage, addVotes, addGameEventToStaffer, payPoliticalCapital, setGameState } =
    gameState.actions;
export const LocalGameStateReducer = gameState.reducer;

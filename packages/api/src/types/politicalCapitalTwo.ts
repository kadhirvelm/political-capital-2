/**
 * Copyright (c) 2022 - KM
 */

import { IPastResolution, IPossibleResolution } from "./IResolution";
import { IPossibleStaffer } from "./IStaffer";

export interface IPlayerState {
    playerRid: string;
    politicalCapital: number;
    partyRid: string;
    staffers: IPossibleStaffer[];
}

export interface IPartyRid {
    partyRid: string;
    partyName: string;
    partyColor: string;
}

export interface IGameState {
    pastResolutions: IPastResolution[];
    currentResolution: IPossibleResolution;

    parties: IPartyRid[];

    playerStates: IPlayerState[];
}

export interface IPlayerHistoricalState {
    playerRid: string;
    politicalCapital: number;
    staffers: IPossibleStaffer[];
}

export interface IPlayer {
    playerRid: string;
    browserIdentifier: string;
    name: string;
}

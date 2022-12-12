/**
 * Copyright (c) 2022 - KM
 */

import { Column, Model, Table } from "sequelize-typescript";
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

@Table({
    tableName: "Game",
    timestamps: false,
})
export class Game extends Model {
    @Column({
        type: "string",
    })
    gameRid!: string;

    @Column({
        type: "boolean",
    })
    isRunning!: boolean;

    @Column({
        type: "string[]",
    })
    playerRids!: string[];

    @Column({
        type: "json",
    })
    gameState!: IGameState;

    @Column({
        type: "string",
    })
    createdAt!: string;
}

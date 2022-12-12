/**
 * Copyright (c) 2022 - KM
 */

import { Column, Model, Table } from "sequelize-typescript";
import { IPossibleStaffer } from "./IStaffer";

export interface IPlayerHistoricalState {
    playerRid: string;
    politicalCapital: number;
    staffers: IPossibleStaffer[];
}

@Table({
    tableName: "HistoricalGameState",
    timestamps: false,
})
export class HistoricalGameState extends Model {
    @Column({
        type: "string",
    })
    historicalGameStateRid!: string;

    @Column({
        type: "string",
    })
    gameRid!: string;

    @Column({
        type: "string",
    })
    atResolutionRid!: string;

    @Column({
        type: "string",
    })
    playerValues!: IPlayerHistoricalState[];

    @Column({
        type: "string",
    })
    createdAt!: string;
}

/**
 * Copyright (c) 2022 - KM
 */

import { IPlayerHistoricalState } from "@pc2/api";
import { Column, Model, Table } from "sequelize-typescript";

interface IHistoricalGameState {
    historicalGameStateRid: string;
    gameRid: string;
    atResolutionRid: string;
    playerValues: IPlayerHistoricalState[];
    createdAt: string;
}

@Table({
    tableName: "HistoricalGameState",
    timestamps: false,
})
export class HistoricalGameState extends Model<IHistoricalGameState> {
    @Column({
        type: "string",
        primaryKey: true,
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

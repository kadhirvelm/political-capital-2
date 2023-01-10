/**
 * Copyright (c) 2023 - KM
 */

import { IHistoricalGameState } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "HistoricalGameState",
    timestamps: false,
})
export class HistoricalGameState extends Model<IHistoricalGameState> {
    @Column({
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare historicalGameStateId?: number | null;

    @Column({
        type: DataTypes.STRING,
    })
    declare gameStateRid: IHistoricalGameState["gameStateRid"];

    @Column({
        type: DataTypes.INTEGER,
    })
    declare gameClock: IHistoricalGameState["gameClock"];

    @Column({
        type: DataTypes.JSONB,
    })
    declare snapshot: IHistoricalGameState["snapshot"];
}

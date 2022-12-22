/**
 * Copyright (c) 2022 - KM
 */

import { IGameState } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "GameState",
    timestamps: false,
})
export class GameState extends Model<IGameState> {
    @Column({
        type: DataTypes.STRING,
        primaryKey: true,
    })
    gameStateRid!: IGameState["gameStateRid"];

    @Column({
        type: DataTypes.STRING,
    })
    state!: IGameState["state"];

    @Column({
        type: DataTypes.INTEGER,
    })
    gameClock!: IGameState["gameClock"];
}

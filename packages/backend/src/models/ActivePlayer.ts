/**
 * Copyright (c) 2022 - KM
 */

import { IActivePlayer } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "ActivePlayer",
    timestamps: false,
})
export class ActivePlayer extends Model<IActivePlayer> {
    @Column({
        type: DataTypes.STRING,
    })
    gameStateRid!: IActivePlayer["gameStateRid"];

    @Column({
        type: DataTypes.STRING,
    })
    playerRid!: IActivePlayer["playerRid"];

    @Column({
        type: DataTypes.INTEGER,
    })
    politicalCapital!: IActivePlayer["politicalCapital"];

    @Column({
        type: DataTypes.INTEGER,
    })
    approvalRating!: IActivePlayer["approvalRating"];
}

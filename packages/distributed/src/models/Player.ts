/**
 * Copyright (c) 2022 - KM
 */

import { IPlayer } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "Player",
    timestamps: false,
})
export class Player extends Model<IPlayer> {
    @Column({
        type: DataTypes.STRING,
        primaryKey: true,
    })
    declare playerRid: IPlayer["playerRid"];

    @Column({
        type: DataTypes.STRING,
    })
    declare browserIdentifier: IPlayer["browserIdentifier"];

    @Column({
        type: DataTypes.STRING,
    })
    declare name: IPlayer["name"];
}

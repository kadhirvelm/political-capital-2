/**
 * Copyright (c) 2022 - KM
 */

import { IPassedGameModifier } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "PassedGameModifier",
    timestamps: false,
})
export class PassedGameModifier extends Model<IPassedGameModifier> {
    @Column({
        type: DataTypes.STRING,
    })
    declare gameStateRid: IPassedGameModifier["gameStateRid"];

    @Column({
        type: DataTypes.STRING,
    })
    declare fromActiveResolutionRid: IPassedGameModifier["fromActiveResolutionRid"];

    @Column({
        type: DataTypes.JSONB,
    })
    declare modifier: IPassedGameModifier["modifier"];

    @Column({
        type: DataTypes.INTEGER,
    })
    declare createdOn: IPassedGameModifier["createdOn"];
}

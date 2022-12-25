/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolution } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "ActiveResolution",
    timestamps: false,
})
export class ActiveResolution extends Model<IActiveResolution> {
    @Column({
        type: DataTypes.STRING,
    })
    gameStateRid!: IActiveResolution["gameStateRid"];

    @Column({
        type: DataTypes.STRING,
        primaryKey: true,
    })
    activeResolutionRid!: IActiveResolution["activeResolutionRid"];

    @Column({
        type: DataTypes.JSONB,
    })
    resolutionDetails!: IActiveResolution["resolutionDetails"];

    @Column({
        type: DataTypes.STRING,
    })
    state!: IActiveResolution["state"];
}

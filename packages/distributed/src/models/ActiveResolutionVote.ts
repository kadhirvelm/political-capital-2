/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolutionVote } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "ActiveResolutionVote",
    timestamps: false,
})
export class ActiveResolutionVote extends Model<IActiveResolutionVote> {
    @Column({
        type: DataTypes.STRING,
    })
    gameStateRid!: IActiveResolutionVote["gameStateRid"];

    @Column({
        type: DataTypes.STRING,
        primaryKey: true,
    })
    activeResolutionRid!: IActiveResolutionVote["activeResolutionRid"];

    @Column({
        type: DataTypes.STRING,
    })
    activeStafferRid!: IActiveResolutionVote["activeStafferRid"];

    @Column({
        type: DataTypes.STRING,
    })
    vote!: IActiveResolutionVote["vote"];
}

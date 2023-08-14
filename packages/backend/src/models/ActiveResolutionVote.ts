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
    declare gameStateRid: IActiveResolutionVote["gameStateRid"];

    @Column({
        type: DataTypes.STRING,
        primaryKey: true,
    })
    declare activeResolutionRid: IActiveResolutionVote["activeResolutionRid"];

    @Column({
        type: DataTypes.STRING,
    })
    declare activeStafferRid: IActiveResolutionVote["activeStafferRid"];

    @Column({
        type: DataTypes.STRING,
    })
    declare vote: IActiveResolutionVote["vote"];
}

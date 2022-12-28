/**
 * Copyright (c) 2022 - KM
 */

import { IActiveStaffer } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "ActiveStaffer",
    timestamps: false,
})
export class ActiveStaffer extends Model<IActiveStaffer> {
    @Column({
        type: DataTypes.STRING,
    })
    declare gameStateRid: IActiveStaffer["gameStateRid"];

    @Column({
        type: DataTypes.STRING,
    })
    declare playerRid: IActiveStaffer["playerRid"];

    @Column({
        type: DataTypes.STRING,
        primaryKey: true,
    })
    declare activeStafferRid: IActiveStaffer["activeStafferRid"];

    @Column({
        type: DataTypes.JSONB,
    })
    declare stafferDetails: IActiveStaffer["stafferDetails"];

    @Column({
        type: DataTypes.STRING,
    })
    declare state: IActiveStaffer["state"];
}

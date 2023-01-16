/**
 * Copyright (c) 2023 - KM
 */

import { IActiveNotification } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "ActiveNotification",
    timestamps: false,
})
export class ActiveNotification extends Model<IActiveNotification> {
    @Column({
        type: DataTypes.STRING,
        primaryKey: true,
    })
    declare activeNotificationRid: IActiveNotification["activeNotificationRid"];

    @Column({
        type: DataTypes.STRING,
    })
    declare gameStateRid: IActiveNotification["gameStateRid"];

    @Column({
        type: DataTypes.JSONB,
    })
    declare notificationDetails: IActiveNotification["notificationDetails"];

    @Column({
        type: DataTypes.STRING,
    })
    declare toPlayerRid: IActiveNotification["toPlayerRid"];

    @Column({
        type: DataTypes.INTEGER,
    })
    declare createdOn: IActiveNotification["createdOn"];

    @Column({
        type: DataTypes.STRING,
    })
    declare status: IActiveNotification["status"];
}

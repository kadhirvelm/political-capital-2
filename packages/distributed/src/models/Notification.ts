/**
 * Copyright (c) 2023 - KM
 */

import { INotification } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "Notification",
    timestamps: false,
})
export class Notification extends Model<INotification> {
    @Column({
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare notificationId?: number | null;

    @Column({
        type: DataTypes.STRING,
    })
    declare gameStateRid: INotification["gameStateRid"];

    @Column({
        type: DataTypes.JSONB,
    })
    declare notificationDetails: INotification["notificationDetails"];

    @Column({
        type: DataTypes.STRING,
    })
    declare toPlayerRid: INotification["toPlayerRid"];

    @Column({
        type: DataTypes.INTEGER,
    })
    declare createdOn: INotification["createdOn"];

    @Column({
        type: DataTypes.STRING,
    })
    declare status: INotification["status"];
}

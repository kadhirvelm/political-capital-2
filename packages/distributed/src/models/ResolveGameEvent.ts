/**
 * Copyright (c) 2022 - KM
 */

import { IResolveGameEvent } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "ResolveGameEvent",
    timestamps: false,
})
export class ResolveGameEvent extends Model<IResolveGameEvent> {
    @Column({
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    resolveGameEventId?: number | null;

    @Column({
        type: DataType.STRING,
    })
    gameStateRid!: IResolveGameEvent["gameStateRid"];

    @Column({
        type: DataType.NUMBER,
    })
    resolvesOn!: IResolveGameEvent["resolvesOn"];

    @Column({
        type: DataType.JSONB,
    })
    eventDetails!: IResolveGameEvent["eventDetails"];

    @Column({
        type: DataType.STRING,
    })
    state!: IResolveGameEvent["state"];
}

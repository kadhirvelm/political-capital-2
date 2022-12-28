/**
 * Copyright (c) 2022 - KM
 */

import { IActivePlayer } from "@pc2/api";
import { DataTypes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "ActivePlayer",
    timestamps: false,
})
export class ActivePlayer extends Model<IActivePlayer> {
    @Column({
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare activePlayerId?: number | null;

    @Column({
        type: DataTypes.STRING,
    })
    declare gameStateRid: IActivePlayer["gameStateRid"];

    @Column({
        type: DataTypes.STRING,
    })
    declare playerRid: IActivePlayer["playerRid"];

    @Column({
        type: DataTypes.INTEGER,
    })
    declare politicalCapital: IActivePlayer["politicalCapital"];

    @Column({
        type: DataTypes.INTEGER,
    })
    declare approvalRating: IActivePlayer["approvalRating"];

    @Column({
        type: DataTypes.INTEGER,
    })
    declare lastUpdatedGameClock: IActivePlayer["lastUpdatedGameClock"];

    @Column({
        type: DataType.BOOLEAN,
    })
    declare isReady: IActivePlayer["isReady"];
}

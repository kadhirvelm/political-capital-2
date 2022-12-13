/**
 * Copyright (c) 2022 - KM
 */

import { IGameState } from "@pc2/api";
import { Column, Model, Table } from "sequelize-typescript";

interface IGame {
    gameRid: string;
    isRunning: boolean;
    playerRids: string[];
    gameState: IGameState;
    createdAt: string;
}

@Table({
    tableName: "Game",
    timestamps: false,
})
export class Game extends Model<IGame> {
    @Column({
        type: "string",
        primaryKey: true,
    })
    gameRid!: string;

    @Column({
        type: "boolean",
    })
    isRunning!: boolean;

    @Column({
        type: "string[]",
    })
    playerRids!: string[];

    @Column({
        type: "json",
    })
    gameState!: IGameState;

    @Column({
        type: "string",
    })
    createdAt!: string;
}

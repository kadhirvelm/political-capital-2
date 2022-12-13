import { Column, Model, Table } from "sequelize-typescript";

interface IPlayer {
    playerRid: string;
    browserIdentifier: string;
    name: string;
}

@Table({
    tableName: "Player",
    timestamps: false,
})
export class Player extends Model<IPlayer> {
    @Column({
        type: "string",
        primaryKey: true,
    })
    playerRid!: string;

    @Column({
        type: "string",
    })
    browserIdentifier!: string;

    @Column({
        type: "string",
    })
    name!: string;
}

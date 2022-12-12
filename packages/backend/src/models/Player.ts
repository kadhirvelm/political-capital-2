import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "Player",
    timestamps: false,
})
export class Player extends Model {
    @Column({
        type: "string",
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

import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "User",
    timestamps: false,
})
export class User extends Model {
    @Column({
        type: "string",
    })
    browserIdentifier!: string;

    @Column({
        type: "string",
    })
    name!: string;

    @Column({
        type: "string",
    })
    createdAt!: string;

    updatedAt!: false;
}

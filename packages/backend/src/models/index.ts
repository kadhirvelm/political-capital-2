import { Sequelize } from "sequelize-typescript";
import { Game } from "./Game";
import { Player } from "./Player";

const sequelize = new Sequelize({
    username: "yugabyte",
    password: undefined,
    database: "political-capital-two",
    host: "localhost",
    port: 5433,
    dialect: "postgres",
    models: [Game, Player],
});

export { sequelize };

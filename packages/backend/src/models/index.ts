import { Sequelize } from "sequelize-typescript";
import { User } from "./User";

const sequelize = new Sequelize({
    username: "yugabyte",
    password: undefined,
    database: "political-capital-two",
    host: "localhost",
    port: 5433,
    dialect: "postgres",
    models: [User],
});

export { sequelize };

import { Sequelize } from "sequelize-typescript";
import { ActivePlayer } from "./ActivePlayer";
import { ActiveResolution } from "./ActiveResolution";
import { ActiveResolutionVote } from "./ActiveResolutionVote";
import { ActiveStaffer } from "./ActiveStaffer";
import { GameState } from "./GameState";
import { Player } from "./Player";

const sequelize = new Sequelize({
    username: "yugabyte",
    password: undefined,
    database: "political-capital-two",
    host: "host.docker.internal",
    port: 5433,
    dialect: "postgres",
    models: [ActivePlayer, ActiveResolution, ActiveResolutionVote, ActiveStaffer, GameState, Player],
});

export { sequelize };

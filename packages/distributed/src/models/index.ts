import { Sequelize } from "sequelize-typescript";
import { ActivePlayer } from "./ActivePlayer";
import { ActiveResolution } from "./ActiveResolution";
import { ActiveResolutionVote } from "./ActiveResolutionVote";
import { ActiveStaffer } from "./ActiveStaffer";
import { GameState } from "./GameState";
import { Player } from "./Player";
import { ResolveGameEvent } from "./ResolveGameEvent";

export { ActivePlayer } from "./ActivePlayer";
export { ActiveResolution } from "./ActiveResolution";
export { ActiveResolutionVote } from "./ActiveResolutionVote";
export { ActiveStaffer } from "./ActiveStaffer";
export { GameState } from "./GameState";
export { Player } from "./Player";
export { ResolveGameEvent } from "./ResolveGameEvent";

export function initializeModels() {
    return new Sequelize({
        username: "yugabyte",
        password: undefined,
        database: process.env.TEST_DATABASE ?? "political-capital-two",
        host: process.env.DATABASE_HOST ?? "localhost",
        port: 5433,
        dialect: "postgres",
        models: [
            ActivePlayer,
            ActiveResolution,
            ActiveResolutionVote,
            ActiveStaffer,
            GameState,
            Player,
            ResolveGameEvent,
        ],
    });
}

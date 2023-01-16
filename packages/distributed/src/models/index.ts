import { Sequelize } from "sequelize-typescript";
import { ActiveNotification } from "./ActiveNotification";
import { ActivePlayer } from "./ActivePlayer";
import { ActiveResolution } from "./ActiveResolution";
import { ActiveResolutionVote } from "./ActiveResolutionVote";
import { ActiveStaffer } from "./ActiveStaffer";
import { GameState } from "./GameState";
import { HistoricalGameState } from "./HistoricalGameState";
import { PassedGameModifier } from "./PassedGameModifier";
import { Player } from "./Player";
import { ResolveGameEvent } from "./ResolveGameEvent";

export { ActiveNotification } from "./ActiveNotification";
export { ActivePlayer } from "./ActivePlayer";
export { ActiveResolution } from "./ActiveResolution";
export { ActiveResolutionVote } from "./ActiveResolutionVote";
export { ActiveStaffer } from "./ActiveStaffer";
export { GameState } from "./GameState";
export { HistoricalGameState } from "./HistoricalGameState";
export { PassedGameModifier } from "./PassedGameModifier";
export { Player } from "./Player";
export { ResolveGameEvent } from "./ResolveGameEvent";

export function initializeModels() {
    return new Sequelize({
        username: "postgres",
        password: "admin",
        database: process.env.TEST_DATABASE ?? "political-capital-two",
        host: process.env.DATABASE_HOST ?? "localhost",
        port: 5432,
        dialect: "postgres",
        logging: false,
        models: [
            ActiveNotification,
            ActivePlayer,
            ActiveResolution,
            ActiveResolutionVote,
            ActiveStaffer,
            GameState,
            HistoricalGameState,
            PassedGameModifier,
            Player,
            ResolveGameEvent,
        ],
    });
}

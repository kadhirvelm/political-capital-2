/**
 * Copyright (c) 2022 - KM
 */

import { IActiveGameService } from "../services/activeGameService";
import { IVisit } from "../types/IVisit";
import { IPlayer } from "../types/politicalCapitalTwo";

export interface IUpdateGameStateMessage {
    newGameState: IActiveGameService["getGameState"]["response"];
    type: "update-game-state";
}

interface IAllFromPlayerMessages {
    updateGameState: IUpdateGameStateMessage;
    unknown: never;
}

export type IPossibleToPlayerMessages = IUpdateGameStateMessage;

export namespace IToPlayerMessages {
    export const isUpdateGameState = (message: IPossibleToPlayerMessages): message is IUpdateGameStateMessage => {
        return message.type === "update-game-state";
    };

    export const visit = <ReturnValue>(
        value: IPossibleToPlayerMessages,
        visitor: IVisit<IAllFromPlayerMessages, ReturnValue>,
    ) => {
        if (isUpdateGameState(value)) {
            return visitor.updateGameState(value);
        }

        return visitor.unknown(value);
    };
}

export interface IRegisterPlayer {
    player: IPlayer;
    type: "register-player";
}

interface IAllToPlayerMessages {
    registerPlayer: IRegisterPlayer;
    unknown: never;
}

export type IPossibleFromPlayerMessages = IRegisterPlayer;

export namespace IFromPlayerMessages {
    export const isRegisterPlayer = (message: IPossibleFromPlayerMessages): message is IRegisterPlayer => {
        return message.type === "register-player";
    };

    export const visit = <ReturnValue>(
        value: IPossibleFromPlayerMessages,
        visitor: IVisit<IAllToPlayerMessages, ReturnValue>,
    ) => {
        if (isRegisterPlayer(value)) {
            return visitor.registerPlayer(value);
        }

        return visitor.unknown(value);
    };
}

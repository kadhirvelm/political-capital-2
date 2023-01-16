/**
 * Copyright (c) 2022 - KM
 */

import { IActiveGameService } from "../services/activeGameService";
import { IGlobalScreenIdentifier } from "../types/BrandedIDs";
import { IVisit } from "../types/IVisit";
import { IActiveNotification, IPlayer } from "../types/politicalCapitalTwo";

export interface IUpdateGameStateMessage {
    newGameState: IActiveGameService["getGameState"]["response"];
    type: "update-game-state";
}

export interface IReceivedNewNotification {
    notification: IActiveNotification;
    type: "new-notification";
}

interface IAllToPlayerMessages {
    updateGameState: IUpdateGameStateMessage;
    receiveNotification: IReceivedNewNotification;
    unknown: never;
}

export type IPossibleToPlayerMessages = IAllToPlayerMessages[keyof IAllToPlayerMessages];

export namespace IToPlayerMessages {
    export const isUpdateGameState = (message: IPossibleToPlayerMessages): message is IUpdateGameStateMessage => {
        return message.type === "update-game-state";
    };

    export const isReceiveNewNotification = (
        message: IPossibleToPlayerMessages,
    ): message is IReceivedNewNotification => {
        return message.type === "new-notification";
    };

    export const visit = <ReturnValue>(
        value: IPossibleToPlayerMessages,
        visitor: IVisit<IAllToPlayerMessages, ReturnValue>,
    ) => {
        if (isUpdateGameState(value)) {
            return visitor.updateGameState(value);
        }

        if (isReceiveNewNotification(value)) {
            return visitor.receiveNotification(value);
        }

        return visitor.unknown(value);
    };
}

export interface IRegisterPlayer {
    player: IPlayer;
    type: "register-player";
}

export interface IRegisterGlobalScreen {
    globalScreenIdentifier: IGlobalScreenIdentifier;
    type: "register-global-screen";
}

interface IAllFromPlayerMessages {
    registerPlayer: IRegisterPlayer;
    registerGlobalScreen: IRegisterGlobalScreen;
    unknown: never;
}

export type IPossibleFromPlayerMessages = IAllFromPlayerMessages[keyof IAllFromPlayerMessages];

export namespace IFromPlayerMessages {
    export const isRegisterPlayer = (message: IPossibleFromPlayerMessages): message is IRegisterPlayer => {
        return message.type === "register-player";
    };

    export const isGlobalScreen = (message: IPossibleFromPlayerMessages): message is IRegisterGlobalScreen => {
        return message.type === "register-global-screen";
    };

    export const visit = <ReturnValue>(
        value: IPossibleFromPlayerMessages,
        visitor: IVisit<IAllFromPlayerMessages, ReturnValue>,
    ) => {
        if (isRegisterPlayer(value)) {
            return visitor.registerPlayer(value);
        }

        if (isGlobalScreen(value)) {
            return visitor.registerGlobalScreen(value);
        }

        return visitor.unknown(value);
    };
}

/*
 * Copyright 2023 KM.
 */

import { type IActiveGameService } from "../services/activeGameService";
import { type IActiveNotification } from "../types/politicalCapitalTwo";
import { type GenericType, type VisitorPattern } from "../types/visit";

export interface IUpdateGameStateMessage {
  newGameState: IActiveGameService["getGameState"]["response"];
  type: "update-game-state";
}

export interface IReceivedNewNotification {
  notification: IActiveNotification;
  type: "new-notification";
}

export interface IAllToPlayerMessages {
  receiveNotification: IReceivedNewNotification;
  updateGameState: IUpdateGameStateMessage;
}

export type IPossibleToPlayerMessages = GenericType<IAllToPlayerMessages>;

export const ToPlayerMessages: VisitorPattern<IAllToPlayerMessages> = {
  typeChecks: {
    receiveNotification: (message): message is IReceivedNewNotification => {
      return message.type === "new-notification";
    },
    updateGameState: (message): message is IUpdateGameStateMessage => {
      return message.type === "update-game-state";
    },
  },
  visit: (value, visitor) => {
    if (ToPlayerMessages.typeChecks.receiveNotification(value)) {
      return visitor.receiveNotification(value);
    }

    if (ToPlayerMessages.typeChecks.updateGameState(value)) {
      return visitor.updateGameState(value);
    }

    return visitor.unknown(value);
  },
};

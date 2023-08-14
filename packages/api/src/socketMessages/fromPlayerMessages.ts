/*
 * Copyright 2023 KM.
 */

import { type IGlobalScreenIdentifier } from "../types/BrandedIDs";
import { type IPlayer } from "../types/politicalCapitalTwo";
import { type GenericType, type VisitorPattern } from "../types/visit";

export interface IRegisterPlayer {
  player: IPlayer;
  type: "register-player";
}

export interface IRegisterGlobalScreen {
  globalScreenIdentifier: IGlobalScreenIdentifier;
  type: "register-global-screen";
}

export interface IAllFromPlayerMessages {
  registerGlobalScreen: IRegisterGlobalScreen;
  registerPlayer: IRegisterPlayer;
}

export type IPossibleFromPlayerMessages = GenericType<IAllFromPlayerMessages>;

export const FromPlayerMessages: VisitorPattern<IAllFromPlayerMessages> = {
  typeChecks: {
    registerGlobalScreen: (message): message is IRegisterGlobalScreen => {
      return message.type === "register-global-screen";
    },
    registerPlayer: (message): message is IRegisterPlayer => {
      return message.type === "register-player";
    },
  },
  visit: (value, visitor) => {
    if (FromPlayerMessages.typeChecks.registerPlayer(value)) {
      return visitor.registerPlayer(value);
    }

    if (FromPlayerMessages.typeChecks.registerGlobalScreen(value)) {
      return visitor.registerGlobalScreen(value);
    }

    return visitor.unknown(value);
  },
};

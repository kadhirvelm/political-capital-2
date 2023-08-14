/*
 * Copyright 2023 KM.
 */

import { type IPlayerRid } from "./BrandedIDs";
import { type IVisit } from "./visit";

interface IBasicNotification {
  type: string;
}

export interface IBetweenPlayersNotification extends IBasicNotification {
  fromPlayer: IPlayerRid;
  message: string;
  type: "between-players";
}

export interface IAnonymousNotification extends IBasicNotification {
  message: string;
  type: "anonymous";
}

export interface IGameNotification extends IBasicNotification {
  message: string;
  type: "game-notification";
}

interface IAllNotifications {
  betweenPlayers: IBetweenPlayersNotification;
  anonymous: IAnonymousNotification;
  game: IGameNotification;
  unknown: never;
}

export type IPossibleNotification = IAllNotifications[keyof IAllNotifications];

export namespace INotification {
  export const isBetweenPlayers = (
    notification: IPossibleNotification,
  ): notification is IBetweenPlayersNotification => {
    return notification.type === "between-players";
  };

  export const isAnonymous = (notification: IPossibleNotification): notification is IAnonymousNotification => {
    return notification.type === "anonymous";
  };

  export const isGame = (notification: IPossibleNotification): notification is IGameNotification => {
    return notification.type === "game-notification";
  };

  export const visit = <ReturnValue>(value: IPossibleNotification, visitor: IVisit<IAllNotifications, ReturnValue>) => {
    if (isBetweenPlayers(value)) {
      return visitor.betweenPlayers(value);
    }

    if (isAnonymous(value)) {
      return visitor.anonymous(value);
    }

    if (isGame(value)) {
      return visitor.game(value);
    }

    return visitor.unknown(value);
  };
}

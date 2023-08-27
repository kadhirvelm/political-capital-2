/*
 * Copyright 2023 KM.
 */

import { type IPlayerRid } from "./BrandedIDs";
import { type GenericType, type VisitorPattern } from "./visit";

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

export interface IAllNotifications {
  anonymous: IAnonymousNotification;
  betweenPlayers: IBetweenPlayersNotification;
  game: IGameNotification;
}

export type IPossibleNotification = GenericType<IAllNotifications>;

export const INotification: VisitorPattern<IAllNotifications> = {
  typeChecks: {
    anonymous: (notification: IPossibleNotification): notification is IAnonymousNotification => {
      return notification.type === "anonymous";
    },
    betweenPlayers: (notification: IPossibleNotification): notification is IBetweenPlayersNotification => {
      return notification.type === "between-players";
    },
    game: (notification: IPossibleNotification): notification is IGameNotification => {
      return notification.type === "game-notification";
    },
  },
  visit: (value, visitor) => {
    if (INotification.typeChecks.anonymous(value)) {
      return visitor.anonymous(value);
    }

    if (INotification.typeChecks.betweenPlayers(value)) {
      return visitor.betweenPlayers(value);
    }

    if (INotification.typeChecks.game(value)) {
      return visitor.game(value);
    }

    return visitor.unknown(value);
  },
};

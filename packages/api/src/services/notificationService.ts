/*
 * Copyright 2023 KM.
 */


import { type IImplementEndpoint, type IService } from "../common/generics";
import { type IActiveNotificationRid, type IPlayerRid } from "../types/BrandedIDs";
import { type IActiveNotification } from "../types/politicalCapitalTwo";

export interface INotificationService extends IService {
  createNewNotification: {
    payload: IActiveNotification;
    response: {};
  };
  getAllNotifications: {
    payload: {
      playerRid: IPlayerRid;
    };
    response: IActiveNotification[];
  };
  markNotificationAsRead: {
    payload: {
      activeNotificationRid: IActiveNotificationRid;
    };
    response: IActiveNotification;
  };
}

export const NotificationService: IImplementEndpoint<INotificationService> = {
  createNewNotification: {
    method: "post",
        slug: "/notification-service/create-new-notification",
  },
  getAllNotifications: {
    method: "post",
        slug: "/notification-service/get-all-notifications",
  },
  markNotificationAsRead: {
    method: "post",
        slug: "/notification-service/mark-notification-as-read",
  },
};

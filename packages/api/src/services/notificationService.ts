/**
 * Copyright (c) 2023 - KM
 */

import { implementEndpoints, IService } from "../common/generics";
import { INotificationRid, IPlayerRid } from "../types/BrandedIDs";
import { INotification } from "../types/politicalCapitalTwo";

export interface INotificationService extends IService {
    createNewNotification: {
        payload: INotification;
        response: {};
    };
    getAllNotifications: {
        payload: {
            playerRid: IPlayerRid;
        };
        response: INotification[];
    };
    markNotificationAsRead: {
        payload: {
            notificationRid: INotificationRid;
        };
        response: INotification;
    };
}

const { backend, frontend } = implementEndpoints<INotificationService>({
    createNewNotification: {
        slug: "/notification-service/create-new-notification",
        method: "post",
    },
    getAllNotifications: {
        slug: "/notification-serivce/get-all-notifications",
        method: "post",
    },
    markNotificationAsRead: {
        slug: "/notification-service/mark-notification-as-read",
        method: "post",
    },
});

export const NotificationServiceBackend = backend;
export const NotificationServiceFrontend = frontend;

/**
 * Copyright (c) 2023 - KM
 */

import { implementEndpoints, IService } from "../common/generics";
import { IActiveNotificationRid, IPlayerRid } from "../types/BrandedIDs";
import { IActiveNotification } from "../types/politicalCapitalTwo";

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

const { backend, frontend } = implementEndpoints<INotificationService>({
    createNewNotification: {
        slug: "/notification-service/create-new-notification",
        method: "post",
    },
    getAllNotifications: {
        slug: "/notification-service/get-all-notifications",
        method: "post",
    },
    markNotificationAsRead: {
        slug: "/notification-service/mark-notification-as-read",
        method: "post",
    },
});

export const NotificationServiceBackend = backend;
export const NotificationServiceFrontend = frontend;

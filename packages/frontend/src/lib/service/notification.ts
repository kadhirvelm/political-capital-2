/*
 * Copyright 2023 KM.
 */

import { implementFrontend } from "./utils/implementService";
import { NotificationService as NotificationServiceApi } from "@pc2/api";

export const NotificationService = implementFrontend(NotificationServiceApi);

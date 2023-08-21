/*
 * Copyright 2023 KM.
 */

import { implementFrontend } from "./utils/implementService";
import { ActiveGameService as ActiveGameServiceApi } from "@pc2/api";

export const ActiveGameService = implementFrontend(ActiveGameServiceApi);

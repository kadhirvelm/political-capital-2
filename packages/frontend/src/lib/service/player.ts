/*
 * Copyright 2023 KM.
 */

import { implementFrontend } from "./utils/implementService";
import { PlayerService as PlayerServiceApi } from "@pc2/api";

export const PlayerService = implementFrontend(PlayerServiceApi);

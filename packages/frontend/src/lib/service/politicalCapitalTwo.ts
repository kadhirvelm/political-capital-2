/*
 * Copyright 2023 KM.
 */

import { implementFrontend } from "./utils/implementService";
import { PoliticalCapitalTwoService as PoliticalCapitalTwoServiceApi } from "@pc2/api";

export const PoliticalCapitalTwoService = implementFrontend(PoliticalCapitalTwoServiceApi);

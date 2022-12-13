/**
 * Copyright (c) 2022 - KM
 */

import { implementEndpoints, IService } from "../common/generics";

export interface IPoliticalCapitalService extends IService {}

const { backend, frontend } = implementEndpoints<IPoliticalCapitalService>({});

export const PoliticalCapitalTwoBackend = backend;
export const PoliticalCapitalTwoFrontend = frontend;

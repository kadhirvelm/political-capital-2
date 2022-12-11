/**
 * Copyright (c) 2022 - KM
 */

import { SampleServiceBackend } from "@pc2/api";
import Express from "express";
import { sampleEndpoint } from "../services/sampleService";
import { configureFrontendRoutes } from "./configureFrontendRoutes";

const mockGetToken = () => null;

export function configureAllRoutes(app: Express.Express) {
    configureFrontendRoutes(app);

    SampleServiceBackend(app, mockGetToken, {
        sampleEndpoint: sampleEndpoint,
    });
}

/**
 * Copyright (c) 2022 - KM
 */

import { SampleServiceBackend } from "@pc2/api";
import Express from "express";
import { sampleEndpoint } from "../services/sampleService";
import { configureFrontendRoutes } from "./configureFrontendRoutes";

const mockGetToken = () => null;

export function configureAllRoutes(app: Express.Express) {
    app.get("/status", (_req, res) => {
        res.status(200).send({ message: "success" });
    });

    SampleServiceBackend(app, mockGetToken, {
        sampleEndpoint: sampleEndpoint,
    });

    configureFrontendRoutes(app);
}

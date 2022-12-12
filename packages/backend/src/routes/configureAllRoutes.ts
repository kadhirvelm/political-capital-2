/**
 * Copyright (c) 2022 - KM
 */

import { SampleServiceBackend } from "@pc2/api";
import Express from "express";
import { User } from "../models/User";
import { sampleEndpoint } from "../services/sampleService";
import { configureFrontendRoutes } from "./configureFrontendRoutes";

const mockGetToken = () => null;

export function configureAllRoutes(app: Express.Express) {
    app.get("/status", (_req, res) => {
        res.status(200).send({ message: "success" });
    });

    app.get("/new-user", async (_req, res) => {
        const newUser = await User.create({
            browserIdentifier: "sample",
            createdAt: new Date().toLocaleString(),
            name: "sample-name",
        });

        res.status(200).send({ newUser });
    });

    SampleServiceBackend(app, mockGetToken, {
        sampleEndpoint: sampleEndpoint,
    });

    configureFrontendRoutes(app);
}

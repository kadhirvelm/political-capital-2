/**
 * Copyright (c) 2022 - KM
 */

import { ORIGIN, PORT } from "@pc2/api";
import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import { createServer } from "http";
import { configureAllRoutes } from "./routes/configureAllRoutes";
import { configureSecurity } from "./security/configureSecurity";

// Initialize the models
import "./models";

// Initialize the socket service
import "./services/socketService";

function setupServer() {
    const app = express();
    const server = createServer(app);

    app.use(compression());
    app.use(express.json({ limit: "50mb" }));
    app.use(bodyParser.json({ limit: "50mb" }));

    app.use(bodyParser.urlencoded({ extended: true }));

    configureSecurity(app);

    configureAllRoutes(app);

    server.listen(PORT as unknown as number | undefined, ORIGIN, () => {
        // eslint-disable-next-line no-console
        console.log({ level: "info", message: `Server started, listening on http://${ORIGIN ?? ""}:${PORT ?? ""}` });
    });
}

setupServer();

/**
 * Copyright (c) 2022 - KM
 */

import Express from "express";
import { join } from "path";

export function configureFrontendRoutes(app: Express.Express) {
    const sounds = ["active.mp3", "complete.mp3", "new-resolution.mp3", "paused.mp3", "tally-resolution.mp3"];
    sounds.forEach((sound) => {
        app.get(`/${sound}`, (_, res) => {
            res.sendFile(join(process.cwd(), `static/${sound}`));
        });
    });

    app.get(`/anonymous.png`, (_, res) => {
        res.sendFile(join(process.cwd(), `static/anonymous.png`));
    });
}

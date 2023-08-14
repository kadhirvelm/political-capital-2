/**
 * Copyright (c) 2022 - KM
 */

import { IPlayerRid, IPlayerService } from "@pc2/api";
import { v4 } from "uuid";
import Express from "express";
import _ from "lodash";
import { Player } from "../models";

export async function getPlayer(
    payload: IPlayerService["getPlayer"]["payload"],
): Promise<IPlayerService["getPlayer"]["response"]> {
    const maybeExistingPlayer = await Player.findOne({ where: { browserIdentifier: payload.browserIdentifier } });

    return {
        player: maybeExistingPlayer ?? undefined,
    };
}

export async function registerNewPlayer(
    payload: IPlayerService["registerNewPlayer"]["payload"],
): Promise<IPlayerService["registerNewPlayer"]["response"]> {
    const newPlayer = await Player.create({
        playerRid: v4() as IPlayerRid,
        browserIdentifier: payload.browserIdentifier,
        name: payload.name,
    });

    return {
        player: newPlayer,
    };
}

export async function updatePlayer(
    payload: IPlayerService["updatePlayer"]["payload"],
    response: Express.Response,
): Promise<IPlayerService["updatePlayer"]["response"] | undefined> {
    const existingPlayer = await Player.findOne({
        where: { playerRid: payload.playerRid, browserIdentifier: payload.browserIdentifier },
    });
    if (existingPlayer == null) {
        response.status(400).send({
            error: `Cannot find a player with ${payload.playerRid} and browser identifier: ${payload.browserIdentifier}.`,
        });
        return undefined;
    }

    const updatedPlayer = await Player.update(
        { ..._.omit(payload, "playerRid", "browserIdentifier") },
        {
            where: { playerRid: payload.playerRid, browserIdentifier: payload.browserIdentifier },
            returning: ["browserIdentifier", "name", "playerRid"],
        },
    );

    return {
        player: updatedPlayer[1][0],
    };
}

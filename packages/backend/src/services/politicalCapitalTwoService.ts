/**
 * Copyright (c) 2022 - KM
 */

import {
    getTotalAllowedRecruits,
    getTotalAllowedTrainees,
    getTotalAllowedVotes,
    IActiveResolutionVote,
    IGameClock,
    IPoliticalCapitalTwoService,
    IResolveGameEvent,
    IStartHiringStaffer,
    IStartTrainingStaffer,
} from "@pc2/api";
import {
    ActiveResolution,
    ActiveResolutionVote,
    ActiveStaffer,
    GameState,
    ResolveGameEvent,
} from "@pc2/distributed-compute";
import Express from "express";

export async function recruitStaffer(
    payload: IPoliticalCapitalTwoService["recruitStaffer"]["payload"],
    response: Express.Response,
): Promise<IPoliticalCapitalTwoService["recruitStaffer"]["response"] | undefined> {
    const [existingRecruitRequests, recruiterStaffer, gameState] = await Promise.all([
        ResolveGameEvent.findAll({
            where: {
                gameStateRid: payload.gameStateRid,
                eventDetails: { recruiterRid: payload.recruitRequest.recruiterRid },
            },
        }),
        ActiveStaffer.findOne({
            where: { gameStateRid: payload.gameStateRid, activeStafferRid: payload.recruitRequest.recruiterRid },
        }),
        GameState.findOne({ where: { gameStateRid: payload.gameStateRid } }),
    ]);

    if (gameState == null) {
        response.status(400).send(`This game does not exist anymore, please refresh the page and try again.`);
        return undefined;
    }

    if (recruiterStaffer == null) {
        response.status(400).send(`Cannot find a recruiter with the rid: ${payload.recruitRequest.recruiterRid}.`);
        return undefined;
    }

    const totalAllowedRecruits = getTotalAllowedRecruits(recruiterStaffer);
    if (existingRecruitRequests.length >= totalAllowedRecruits) {
        response.status(400).send(`This recruiter is already at capacity, please use another recruiter.`);
        return undefined;
    }

    const startHiringEvent: IStartHiringStaffer = {
        ...payload.recruitRequest,
        type: "start-hiring-staffer",
    };

    const newHiringEvent: IResolveGameEvent = {
        gameStateRid: payload.gameStateRid,
        resolvesOn: (gameState.gameClock + 1) as IGameClock,
        eventDetails: startHiringEvent,
        state: "active",
    };

    await ResolveGameEvent.create(newHiringEvent);

    return {
        pendingEvent: {
            gameStateRid: newHiringEvent.gameStateRid,
            eventDetails: startHiringEvent,
            state: "pending",
        },
    };
}

export async function trainStaffer(
    payload: IPoliticalCapitalTwoService["trainStaffer"]["payload"],
    response: Express.Response,
): Promise<IPoliticalCapitalTwoService["trainStaffer"]["response"] | undefined> {
    const [existingTrainRequests, trainerStaffer, gameState] = await Promise.all([
        ResolveGameEvent.findAll({
            where: {
                gameStateRid: payload.gameStateRid,
                eventDetails: { trainerRid: payload.trainRequest.trainerRid },
            },
        }),
        ActiveStaffer.findOne({
            where: { gameStateRid: payload.gameStateRid, activeStafferRid: payload.trainRequest.trainerRid },
        }),
        GameState.findOne({ where: { gameStateRid: payload.gameStateRid } }),
    ]);

    if (gameState == null) {
        response.status(400).send(`This game does not exist anymore, please refresh the page and try again.`);
        return undefined;
    }

    if (trainerStaffer == null) {
        response.status(400).send(`Cannot find a recruiter with the rid: ${payload.trainRequest.trainerRid}.`);
        return undefined;
    }

    const totalAllowedTrains = getTotalAllowedTrainees(trainerStaffer);
    if (existingTrainRequests.length >= totalAllowedTrains) {
        response.status(400).send(`This trainer is already at capacity, please use another trainer.`);
        return undefined;
    }

    const startTrainingEvent: IStartTrainingStaffer = {
        ...payload.trainRequest,
        type: "start-training-staffer",
    };

    const newTrainingEvent: IResolveGameEvent = {
        gameStateRid: payload.gameStateRid,
        resolvesOn: (gameState.gameClock + 1) as IGameClock,
        eventDetails: startTrainingEvent,
        state: "active",
    };

    await ResolveGameEvent.create(newTrainingEvent);

    return {
        pendingEvent: {
            gameStateRid: newTrainingEvent.gameStateRid,
            eventDetails: startTrainingEvent,
            state: "pending",
        },
    };
}

export async function castVote(
    payload: IPoliticalCapitalTwoService["castVote"]["payload"],
    response: Express.Response,
): Promise<IPoliticalCapitalTwoService["castVote"]["response"] | undefined> {
    const [existingVotes, votingStaffer, activeResolution] = await Promise.all([
        ActiveResolutionVote.findAll({ where: { activeStafferRid: payload.votingStafferRid } }),
        ActiveStaffer.findOne({
            where: { gameStateRid: payload.gameStateRid, activeStafferRid: payload.votingStafferRid },
        }),
        ActiveResolution.findOne({ where: { activeResolutionRid: payload.activeResolutionRid } }),
    ]);

    if (activeResolution == null || activeResolution.state !== "active") {
        response.status(400).send(`This resolution has already been tallied, please refresh your page and try again.`);
        return undefined;
    }

    if (votingStaffer == null) {
        response
            .status(400)
            .send(
                `Cannot find a voting staffer with the rid: ${payload.votingStafferRid}. Please refresh your page and try again.`,
            );
        return undefined;
    }

    const totalAllowedVotes = getTotalAllowedVotes(votingStaffer);
    if (totalAllowedVotes >= existingVotes.length) {
        response.status(400).send(`This staffer has already voted, please refresh your page and try again.`);
        return undefined;
    }

    if (totalAllowedVotes < payload.votes.length) {
        response
            .status(400)
            .send(
                `This staffer is only allowed ${totalAllowedVotes}, but ${payload.votes.length} were sent. Please try again.`,
            );
        return undefined;
    }

    const newActiveVotes = payload.votes.map((vote): IActiveResolutionVote => {
        return {
            gameStateRid: payload.gameStateRid,
            activeResolutionRid: payload.activeResolutionRid,
            activeStafferRid: payload.votingStafferRid,
            vote,
        };
    });

    await ActiveResolutionVote.bulkCreate(newActiveVotes);

    return {
        votes: newActiveVotes,
    };
}

/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getEffectivenessModifier,
    getTotalAllowedRecruits,
    getTotalAllowedTrainees,
    getTotalAllowedVotes,
    IActiveResolutionVote,
    IGameClock,
    IPoliticalCapitalTwoService,
    IResolveGameEvent,
    isStafferHiringDisabled,
    IStartHiringStaffer,
    IStartTrainingStaffer,
    isVoter,
} from "@pc2/api";
import {
    ActiveResolution,
    ActiveResolutionVote,
    ActiveStaffer,
    GameState,
    PassedGameModifier,
    ResolveGameEvent,
} from "@pc2/distributed-compute";
import Express from "express";
import _ from "lodash";
import { Op } from "sequelize";

export async function recruitStaffer(
    payload: IPoliticalCapitalTwoService["recruitStaffer"]["payload"],
    response: Express.Response,
): Promise<IPoliticalCapitalTwoService["recruitStaffer"]["response"] | undefined> {
    const [existingRecruitRequests, recruiterStaffer, gameState, passedGameModifiers] = await Promise.all([
        ResolveGameEvent.findAll({
            where: {
                gameStateRid: payload.gameStateRid,
                eventDetails: { recruiterRid: payload.recruitRequest.recruiterRid },
                state: "active",
            },
        }),
        ActiveStaffer.findOne({
            where: { gameStateRid: payload.gameStateRid, activeStafferRid: payload.recruitRequest.recruiterRid },
        }),
        GameState.findOne({ where: { gameStateRid: payload.gameStateRid } }),
        PassedGameModifier.findAll({ where: { gameStateRid: payload.gameStateRid } }),
    ]);

    if (gameState == null) {
        response
            .status(400)
            .send({ error: `This game does not exist anymore, please refresh the page and try again.` });
        return undefined;
    }

    if (gameState.state !== "active") {
        response.status(400).send({ error: `The game is not active right now, please resume the game and try again.` });
        return undefined;
    }

    if (recruiterStaffer == null) {
        response
            .status(400)
            .send({ error: `Cannot find a recruiter with the rid: ${payload.recruitRequest.recruiterRid}.` });
        return undefined;
    }

    const effectivenessModifier = getEffectivenessModifier(passedGameModifiers, recruiterStaffer);
    const totalAllowedRecruits = Math.floor(getTotalAllowedRecruits(recruiterStaffer) * effectivenessModifier);
    if (existingRecruitRequests.length >= totalAllowedRecruits) {
        response.status(400).send({ error: `This recruiter is already at capacity, please use another recruiter.` });
        return undefined;
    }

    const isDisabled = isStafferHiringDisabled(
        passedGameModifiers,
        DEFAULT_STAFFER[payload.recruitRequest.stafferType],
    );
    if (isDisabled) {
        response.status(400).send({ error: `Due to the game modifiers, hiring this type of staffer is not allowed.` });
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
    const [
        existingTrainRequests,
        existingActiveStafferRequests,
        trainerStaffer,
        attemptToTrainStaffer,
        gameState,
        passedGameModifiers,
    ] = await Promise.all([
        ResolveGameEvent.findAll({
            where: {
                gameStateRid: payload.gameStateRid,
                eventDetails: { trainerRid: payload.trainRequest.trainerRid },
                state: "active",
            },
        }),
        ResolveGameEvent.findAll({
            where: {
                gameStateRid: payload.gameStateRid,
                eventDetails: {
                    [Op.or]: [
                        // Cannot already be training
                        { activeStafferRid: payload.trainRequest.activeStafferRid },
                        // Cannot be training someone else
                        { trainerRid: payload.trainRequest.activeStafferRid },
                        // Cannot be recruiting
                        { recruiterRid: payload.trainRequest.activeStafferRid },
                    ],
                } as any,
                state: "active",
            },
        }),
        ActiveStaffer.findOne({
            where: { gameStateRid: payload.gameStateRid, activeStafferRid: payload.trainRequest.trainerRid },
        }),
        ActiveStaffer.findOne({
            where: { gameStateRid: payload.gameStateRid, activeStafferRid: payload.trainRequest.activeStafferRid },
        }),
        GameState.findOne({ where: { gameStateRid: payload.gameStateRid } }),
        PassedGameModifier.findAll({ where: { gameStateRid: payload.gameStateRid } }),
    ]);

    if (gameState == null) {
        response
            .status(400)
            .send({ error: `This game does not exist anymore, please refresh the page and try again.` });
        return undefined;
    }

    if (gameState.state !== "active") {
        response.status(400).send({ error: `The game is not active right now, please resume the game and try again.` });
        return undefined;
    }

    if (trainerStaffer == null || attemptToTrainStaffer == null) {
        response.status(400).send({
            error: `Cannot find a recruiter with the rid: ${payload.trainRequest.trainerRid} or the active staffer with the rid: ${payload.trainRequest.activeStafferRid}.`,
        });
        return undefined;
    }

    if (payload.trainRequest.trainerRid === payload.trainRequest.activeStafferRid) {
        response.status(400).send({ error: `A trainer cannot train themselves. Please try again.` });
        return undefined;
    }

    const effectivenessModifier = getEffectivenessModifier(passedGameModifiers, trainerStaffer);
    const totalAllowedTrains = Math.floor(getTotalAllowedTrainees(trainerStaffer) * effectivenessModifier);
    if (existingTrainRequests.length >= totalAllowedTrains) {
        response.status(400).send({ error: `This trainer is already at capacity, please use another trainer.` });
        return undefined;
    }

    if (existingActiveStafferRequests.length > 0) {
        response
            .status(400)
            .send({ error: `Cannot train this staffer, they are currently busy. Please select someone else.` });
        return undefined;
    }

    const isDisabled = isStafferHiringDisabled(passedGameModifiers, attemptToTrainStaffer);
    if (isDisabled) {
        response
            .status(400)
            .send({ error: `Due to the game modifiers, training this type of staffer is not allowed.` });
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
    const [existingVotes, votingStaffer, activeResolution, gameState, passedGameModifiers] = await Promise.all([
        ActiveResolutionVote.findAll({ where: { activeStafferRid: payload.votingStafferRid } }),
        ActiveStaffer.findOne({
            where: { gameStateRid: payload.gameStateRid, activeStafferRid: payload.votingStafferRid },
        }),
        ActiveResolution.findOne({ where: { activeResolutionRid: payload.activeResolutionRid } }),
        GameState.findOne({ where: { gameStateRid: payload.gameStateRid } }),
        PassedGameModifier.findAll({ where: { gameStateRid: payload.gameStateRid } }),
    ]);

    if (gameState == null || gameState.state !== "active") {
        response.status(400).send({ error: `The game is not active right now, please resume the game and try again.` });
        return undefined;
    }

    if (activeResolution == null || activeResolution.state !== "active") {
        response
            .status(400)
            .send({ error: `This resolution has already been tallied, please refresh your page and try again.` });
        return undefined;
    }

    if (votingStaffer == null || !isVoter(votingStaffer.stafferDetails)) {
        response.status(400).send({
            error: `Cannot find a voting staffer with the rid: ${payload.votingStafferRid}. Please refresh your page and try again.`,
        });
        return undefined;
    }

    if (votingStaffer.state === "disabled") {
        response
            .status(400)
            .send({ error: `This staffer is currently busy, please select another one and try again.` });
        return undefined;
    }

    const effectivenessModifier = getEffectivenessModifier(passedGameModifiers, votingStaffer);
    const totalAllowedVotes = Math.floor(getTotalAllowedVotes(votingStaffer) * effectivenessModifier);
    if (existingVotes.length >= totalAllowedVotes) {
        response.status(400).send({ error: `This staffer has already voted, please refresh your page and try again.` });
        return undefined;
    }

    const newActiveVotes: IActiveResolutionVote[] = [];

    if (votingStaffer.stafferDetails.isIndependent) {
        _.range(totalAllowedVotes).forEach(() => {
            newActiveVotes.push({
                gameStateRid: payload.gameStateRid,
                activeResolutionRid: payload.activeResolutionRid,
                activeStafferRid: payload.votingStafferRid,
                vote: "passed",
            });

            newActiveVotes.push({
                gameStateRid: payload.gameStateRid,
                activeResolutionRid: payload.activeResolutionRid,
                activeStafferRid: payload.votingStafferRid,
                vote: "failed",
            });
        });
    } else {
        _.range(totalAllowedVotes).forEach(() => {
            newActiveVotes.push({
                gameStateRid: payload.gameStateRid,
                activeResolutionRid: payload.activeResolutionRid,
                activeStafferRid: payload.votingStafferRid,
                vote: payload.vote,
            });
        });
    }

    await ActiveResolutionVote.bulkCreate(newActiveVotes);

    return {
        votes: newActiveVotes,
    };
}

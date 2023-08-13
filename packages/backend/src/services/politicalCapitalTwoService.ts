/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getTotalAllowedRecruits,
    getTotalAllowedTrainees,
    getTotalAllowedVotes,
    IActiveResolutionVote,
    IActiveStaffer,
    IAllStaffers,
    IGameClock,
    IGameStateRid,
    IPlayerRid,
    IPoliticalCapitalTwoService,
    IResolveGameEvent,
    isStafferHiringDisabled,
    isStafferTrainingDisabled,
    IStartHiringStaffer,
    IStartTrainingStaffer,
    isVoter,
} from "@pc2/api";
import Express from "express";
import _ from "lodash";
import { Op } from "sequelize";
import {
    ActiveStaffer,
    ResolveGameEvent,
    ActiveResolution,
    ActiveResolutionVote,
    GameState,
    PassedGameModifier,
} from "../models";

async function doesExceedLimitForPlayer(
    gameStateRid: IGameStateRid,
    playerRid: IPlayerRid,
    stafferType: Exclude<keyof IAllStaffers, "unknown">,
    type: "recruiting" | "training",
) {
    const maybeLimitPerParty = DEFAULT_STAFFER[stafferType].limitPerParty;
    if (maybeLimitPerParty === undefined) {
        return false;
    }

    const partialStartHiring: Partial<IStartHiringStaffer> = {
        playerRid,
        stafferType,
        type: "start-hiring-staffer",
    };

    const partialStartTraining: Partial<IStartTrainingStaffer> = {
        playerRid,
        toLevel: stafferType,
        type: "start-training-staffer",
    };

    const [existingStaffersOfType, soonToBeStaffersOfType] = await Promise.all([
        ActiveStaffer.findAll({
            where: { gameStateRid: gameStateRid, playerRid, stafferDetails: { type: stafferType } },
        }),
        type === "recruiting"
            ? ResolveGameEvent.findAll({ where: { gameStateRid, eventDetails: partialStartHiring, state: "active" } })
            : ResolveGameEvent.findAll({
                  where: { gameStateRid, eventDetails: partialStartTraining, state: "active" },
              }),
    ]);

    const totalStaffersOfType = existingStaffersOfType.length + soonToBeStaffersOfType.length;
    return totalStaffersOfType >= maybeLimitPerParty;
}

async function isStafferBusy(
    gameStateRid: IGameStateRid,
    attemptToTrainStaffer: IActiveStaffer,
    existingActiveStafferRequests: IResolveGameEvent[],
) {
    if (existingActiveStafferRequests.length > 0) {
        return true;
    }

    if (!isVoter(attemptToTrainStaffer)) {
        return false;
    }

    const currentResolution = await ActiveResolution.findOne({
        where: { gameStateRid: gameStateRid, state: "active" },
    });
    if (currentResolution == null) {
        return false;
    }

    const maybeVotesByStaffer = await ActiveResolutionVote.findAll({
        where: {
            gameStateRid: gameStateRid,
            activeResolutionRid: currentResolution.activeResolutionRid,
            activeStafferRid: attemptToTrainStaffer.activeStafferRid,
        },
    });

    return maybeVotesByStaffer.length !== 0;
}

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

    const totalAllowedRecruits = getTotalAllowedRecruits(recruiterStaffer, passedGameModifiers);
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

    if (
        await doesExceedLimitForPlayer(
            payload.gameStateRid,
            payload.recruitRequest.playerRid,
            payload.recruitRequest.stafferType,
            "recruiting",
        )
    ) {
        response.status(400).send({
            error: `You have reached the limit for this kind of staffer, please try recruiting a different type.`,
        });
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

    const totalAllowedTrains = getTotalAllowedTrainees(trainerStaffer, passedGameModifiers);
    if (existingTrainRequests.length >= totalAllowedTrains) {
        response.status(400).send({ error: `This trainer is already at capacity, please use another trainer.` });
        return undefined;
    }

    const isDisabled = isStafferTrainingDisabled(passedGameModifiers, attemptToTrainStaffer);
    if (isDisabled) {
        response
            .status(400)
            .send({ error: `Due to the game modifiers, training this type of staffer is not allowed.` });
        return undefined;
    }

    if (
        await doesExceedLimitForPlayer(
            payload.gameStateRid,
            payload.trainRequest.playerRid,
            payload.trainRequest.toLevel,
            "training",
        )
    ) {
        response.status(400).send({
            error: `You have reached the limit for this kind of staffer, please try training to a different type.`,
        });
        return undefined;
    }

    if (await isStafferBusy(payload.gameStateRid, attemptToTrainStaffer, existingActiveStafferRequests)) {
        response
            .status(400)
            .send({ error: `Cannot train this staffer, they are currently busy. Please select someone else.` });
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
        ActiveResolutionVote.findAll({
            where: { activeStafferRid: payload.votingStafferRid, activeResolutionRid: payload.activeResolutionRid },
        }),
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

    const totalAllowedVotes = getTotalAllowedVotes(votingStaffer, passedGameModifiers);

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

    const payoutEarlyVoting: IResolveGameEvent = {
        gameStateRid: payload.gameStateRid,
        resolvesOn: (gameState.gameClock + 1) as IGameClock,
        eventDetails: {
            playerRid: votingStaffer.playerRid,
            activeStafferRid: votingStaffer.activeStafferRid,
            onActiveResolutionRid: payload.activeResolutionRid,
            type: "payout-early-voting",
        },
        state: "active",
    };

    await Promise.all([ActiveResolutionVote.bulkCreate(newActiveVotes), ResolveGameEvent.create(payoutEarlyVoting)]);

    return {
        votes: newActiveVotes,
    };
}

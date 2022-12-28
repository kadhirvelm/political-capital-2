/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    IActiveStaffer,
    IActiveStafferRid,
    IEvent,
    IFinishHiringStaffer,
    IFinishTrainingStaffer,
    IGameClock,
    IGameStateRid,
    IPlayerRid,
    IStaffer,
    IStartHiringStaffer,
    IStartTrainingStaffer,
    ITallyResolution,
} from "@pc2/api";
import { DoneCallback, Job } from "bull";
import { Op } from "sequelize";
import { ActivePlayer, ActiveResolution, ActiveResolutionVote, ActiveStaffer, ResolveGameEvent } from "../models";
import { IProcessPlayerQueue, UpdatePlayerQueue } from "../queues";
import crypto from "crypto";

async function getPayoutForPlayer(
    gameStateRid: IGameStateRid,
    eventDetails: ITallyResolution,
    activePlayerStaffers: ActiveStaffer[],
): Promise<number> {
    const [activeResolution, allVotesForResolution] = await Promise.all([
        ActiveResolution.findOne({ where: { gameStateRid, activeResolutionRid: eventDetails.activeResolutionRid } }),
        ActiveResolutionVote.findAll({
            where: {
                gameStateRid,
                activeResolutionRid: eventDetails.activeResolutionRid,
                activeStafferRid: activePlayerStaffers.map((a) => a.activeStafferRid),
            },
        }),
    ]);

    if (activeResolution == null) {
        return 0;
    }

    const payoutPerVote = activeResolution.resolutionDetails.politicalCapitalPayout;
    const correctVotes = allVotesForResolution.filter((vote) => vote.vote === activeResolution.state).length;

    return correctVotes * payoutPerVote;
}

async function handleFinishHiringOrTraining(
    finishHiringOrTraining: Array<IFinishHiringStaffer | IFinishTrainingStaffer>,
    finishHiringOrTrainingModels: ResolveGameEvent[],
): Promise<IActiveStafferRid[]> {
    const updateStaffersToActive = finishHiringOrTraining.map((event) => event.activeStafferRid);

    await Promise.all([
        ActiveStaffer.update({ state: "active" }, { where: { activeStafferRid: updateStaffersToActive } }),
        Promise.all(
            finishHiringOrTrainingModels.map((event) => {
                event.state = "complete";
                return event.save();
            }),
        ),
    ]);

    return updateStaffersToActive;
}

function getPayoutForStaffer(staffer: IActiveStaffer) {
    if (staffer.state === "disabled") {
        return 0;
    }

    return IStaffer.visit(staffer.stafferDetails, {
        intern: () => 0,
        representative: () => 0,
        seniorRepresentative: () => 0,
        phoneBanker: (phoneBanker) => phoneBanker.payout,
        recruiter: () => 0,
        partTimeInstructor: () => 0,
        unknown: () => 0,
    });
}

export async function handleStartHiringOrTraining(
    gameStateRid: IGameStateRid,
    playerRid: IPlayerRid,
    startHiringOrTraining: Array<IStartHiringStaffer | IStartTrainingStaffer>,
    currentGameClock: IGameClock,
    startHiringOrTrainingModels: ResolveGameEvent[],
): Promise<number> {
    const totalCosts = await Promise.all(
        startHiringOrTraining.map(async (trainingOrHiring, index): Promise<number> => {
            const accordingModel = startHiringOrTrainingModels[index];
            accordingModel.state = "complete";

            if (IEvent.isStartHireStaffer(trainingOrHiring)) {
                const newStafferRid = crypto.randomUUID() as IActiveStafferRid;
                const newStafferDetails = DEFAULT_STAFFER[trainingOrHiring.stafferType];

                await Promise.all([
                    ActiveStaffer.create({
                        gameStateRid,
                        playerRid,
                        activeStafferRid: newStafferRid,
                        stafferDetails: newStafferDetails,
                        state: "disabled",
                    }),
                    ResolveGameEvent.create({
                        gameStateRid,
                        resolvesOn: (currentGameClock + newStafferDetails.timeToAcquire) as IGameClock,
                        eventDetails: {
                            playerRid,
                            recruiterRid: trainingOrHiring.recruiterRid,
                            activeStafferRid: newStafferRid,
                            type: "finish-hiring-staffer",
                        },
                        state: "active",
                    }),
                    accordingModel.save(),
                ]);

                return newStafferDetails.costToAcquire;
            }

            if (IEvent.isStartTrainingStaffer(trainingOrHiring)) {
                const newStafferDetails = DEFAULT_STAFFER[trainingOrHiring.toLevel];

                await Promise.all([
                    ActiveStaffer.update(
                        {
                            stafferDetails: newStafferDetails,
                            state: "disabled",
                        },
                        {
                            where: {
                                gameStateRid,
                                activeStafferRid: trainingOrHiring.activeStafferRid,
                            },
                        },
                    ),
                    ResolveGameEvent.create({
                        gameStateRid,
                        resolvesOn: (currentGameClock + newStafferDetails.timeToAcquire) as IGameClock,
                        eventDetails: {
                            playerRid,
                            trainerRid: trainingOrHiring.trainerRid,
                            activeStafferRid: trainingOrHiring.activeStafferRid,
                            type: "finish-training-staffer",
                        },
                        state: "active",
                    }),
                    accordingModel.save(),
                ]);

                return newStafferDetails.costToAcquire;
            }

            return 0;
        }),
    );

    return totalCosts.reduce((previous, next) => previous + next, 0);
}

export async function handlePlayerProcessor(job: Job<IProcessPlayerQueue>, done: DoneCallback) {
    const { gameStateRid, playerRid, gameClock } = job.data;

    const [activePlayer, activePlayerStaffers] = await Promise.all([
        ActivePlayer.findOne({ where: { gameStateRid, playerRid } }),
        ActiveStaffer.findAll({ where: { gameStateRid, playerRid } }),
    ]);

    if (activePlayer == null) {
        return;
    }

    const handleEventsForPlayer = await ResolveGameEvent.findAll({
        where: {
            gameStateRid,
            resolvesOn: gameClock,
            eventDetails: {
                [Op.or]: [{ type: "tally-resolution" }, { playerRid }],
            } as any,
        },
    });

    // Add any political capital the player gained from voting
    const possibleResolutionPayout = handleEventsForPlayer.find((event) =>
        IEvent.isTallyResolution(event.eventDetails),
    );
    if (possibleResolutionPayout !== undefined && IEvent.isTallyResolution(possibleResolutionPayout.eventDetails)) {
        const totalPayoutForPlayer = await getPayoutForPlayer(
            gameStateRid,
            possibleResolutionPayout.eventDetails,
            activePlayerStaffers,
        );
        activePlayer.politicalCapital += totalPayoutForPlayer;
    }

    // Then handle any training or hiring completions
    const finishHiringOrTraining = handleEventsForPlayer.filter(
        (event) =>
            IEvent.isFinishHiringStaffer(event.eventDetails) || IEvent.isFinishTrainingStaffer(event.eventDetails),
    );
    if (finishHiringOrTraining.length > 0) {
        const updatedStaffersToActive = await handleFinishHiringOrTraining(
            finishHiringOrTraining.map((event) => event.eventDetails) as Array<
                IFinishHiringStaffer | IFinishTrainingStaffer
            >,
            finishHiringOrTraining,
        );

        activePlayerStaffers.forEach((activeStaffer) => {
            if (activeStaffer.state === "active") {
                return;
            }

            activeStaffer.state = updatedStaffersToActive.includes(activeStaffer.activeStafferRid)
                ? "active"
                : "disabled";
        });
    }

    // Then any payouts from staffers
    const deltaInPoliticalCapital = activePlayerStaffers
        .map((activeStaffer) => getPayoutForStaffer(activeStaffer))
        .reduce((previous, next) => previous + next, 0);
    activePlayer.politicalCapital += deltaInPoliticalCapital;

    // And finally start any trainings or hirings
    const startHiringOrTraining = handleEventsForPlayer.filter(
        (event) => IEvent.isStartHireStaffer(event.eventDetails) || IEvent.isStartTrainingStaffer(event.eventDetails),
    );
    if (startHiringOrTraining.length > 0) {
        const deltaInPoliticalCapitalFromHiringAndTraining = await handleStartHiringOrTraining(
            gameStateRid,
            playerRid,
            startHiringOrTraining.map((event) => event.eventDetails) as Array<
                IStartHiringStaffer | IStartTrainingStaffer
            >,
            gameClock,
            startHiringOrTraining,
        );
        activePlayer.politicalCapital -= deltaInPoliticalCapitalFromHiringAndTraining;
    }

    // Each process would have updated the total political capital of the player, so we'll need to save
    activePlayer.lastUpdatedGameClock = gameClock;
    await activePlayer.save();

    UpdatePlayerQueue.add({ gameStateRid: job.data.gameStateRid, playerRid: job.data.playerRid });
    done();
}

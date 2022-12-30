/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getPayoutForStaffer,
    IActiveStafferRid,
    IEvent,
    IFinishHiringStaffer,
    IFinishTrainingStaffer,
    IGameClock,
    IGameStateRid,
    IPlayerRid,
    IStartHiringStaffer,
    IStartTrainingStaffer,
    ITallyResolution,
} from "@pc2/api";
import { DoneCallback, Job } from "bull";
import crypto from "crypto";
import { Op } from "sequelize";
import { ActivePlayer, ActiveResolution, ActiveResolutionVote, ActiveStaffer, ResolveGameEvent } from "../models";
import { IProcessPlayerQueue, UpdatePlayerQueue } from "../queues";
import { getStafferOfType } from "../utils/getStafferOfType";

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
                const newStafferDetails = getStafferOfType(trainingOrHiring.stafferType);

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

                const existingStaffer = await ActiveStaffer.findOne({
                    where: { gameStateRid, activeStafferRid: trainingOrHiring.activeStafferRid },
                });

                await Promise.all([
                    ActiveStaffer.update(
                        {
                            stafferDetails: {
                                ...newStafferDetails,
                                displayName:
                                    existingStaffer?.stafferDetails.displayName ?? newStafferDetails.displayName,
                            },
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

    const possibleTallyEvent = await ResolveGameEvent.findOne({
        where: {
            gameStateRid,
            resolvesOn: gameClock,
            eventDetails: {
                type: "tally-resolution",
            },
        },
    });

    // Add any political capital the player gained from voting
    if (possibleTallyEvent != null && IEvent.isTallyResolution(possibleTallyEvent.eventDetails)) {
        const totalPayoutForPlayer = await getPayoutForPlayer(
            gameStateRid,
            possibleTallyEvent.eventDetails,
            activePlayerStaffers,
        );
        activePlayer.politicalCapital += totalPayoutForPlayer;
    }

    const handleEventsForPlayer = await ResolveGameEvent.findAll({
        where: {
            gameStateRid,
            resolvesOn: { [Op.lte]: gameClock } as any,
            eventDetails: {
                playerRid,
            },
            state: "active",
        },
    });

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

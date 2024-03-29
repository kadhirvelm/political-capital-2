/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_STAFFER,
    getEarlyVoteBonus,
    getEarlyVotingBonusModifier,
    getPayoutPerPlayerModifier,
    getStafferAcquisitionCost,
    getStafferAcquisitionTime,
    getTotalAllowedVotes,
    getTotalPayout,
    IActivePlayer,
    IActiveStaffer,
    IActiveStafferRid,
    IEvent,
    IFinishHiringStaffer,
    IFinishTrainingStaffer,
    IGameClock,
    IGameStateRid,
    IPassedGameModifier,
    IPayoutEarlyVoting,
    IPlayerRid,
    IStartHiringStaffer,
    IStartTrainingStaffer,
    ITallyResolution,
} from "@pc2/api";
import { DoneCallback, Job } from "bull";
import crypto from "crypto";
import _ from "lodash";
import { Op } from "sequelize";
import {
    ActivePlayer,
    ActiveResolution,
    ActiveResolutionVote,
    ActiveStaffer,
    PassedGameModifier,
    ResolveGameEvent,
} from "../models";
import { IProcessPlayerQueue, SendNotificationToPlayerQueue, UpdatePlayerQueue } from "../queue/queues";
import { getStafferOfType } from "../utils/getStafferOfType";

async function getPayoutForPlayer(
    gameStateRid: IGameStateRid,
    eventDetails: ITallyResolution,
    activePlayerStaffers: ActiveStaffer[],
    playerRid: IPlayerRid,
    gameClock: IGameClock,
    passedGameModifiers: IPassedGameModifier[],
): Promise<number> {
    const [activeResolution, allVotesForResolution] = await Promise.all([
        ActiveResolution.findOne({ where: { gameStateRid, activeResolutionRid: eventDetails.activeResolutionRid } }),
        ActiveResolutionVote.findAll({
            where: {
                gameStateRid,
                activeResolutionRid: eventDetails.activeResolutionRid,
            },
        }),
    ]);

    if (activeResolution == null) {
        return 0;
    }

    const allCorrectVotes = allVotesForResolution.filter((vote) => vote.vote === activeResolution.state);

    const thisPlayersStaffers = activePlayerStaffers.map((staffer) => staffer.activeStafferRid);
    const thisPlayersCorrectVotes = allCorrectVotes.filter((vote) =>
        thisPlayersStaffers.includes(vote.activeStafferRid),
    );

    const modifier = getPayoutPerPlayerModifier(passedGameModifiers, activePlayerStaffers);
    const thisPlayerCorrectVotesPercentage = thisPlayersCorrectVotes.length / Math.max(allCorrectVotes.length, 1);
    const totalEarnedPoliticalCapital =
        activeResolution.resolutionDetails.politicalCapitalPayout * thisPlayerCorrectVotesPercentage * modifier;

    SendNotificationToPlayerQueue.add({
        gameStateRid,
        playerRid,
        notificationDetails: {
            type: "game-notification",
            message: `You earned ${_.round(totalEarnedPoliticalCapital, 1)} political capital by having ${_.round(
                thisPlayerCorrectVotesPercentage * 100,
                2,
            )}% of the ${activeResolution.state === "passed" ? "Yes" : "No"} votes.${
                modifier !== 1 ? ` ${_.round((modifier - 1) * 100, 2)}% modifier on amount earned.` : ""
            }`,
        },
        createdOn: gameClock,
    });

    return totalEarnedPoliticalCapital;
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

async function handleEarlyVotingPayouts(
    gameStateRid: IGameStateRid,
    earlyVotingPayouts: IPayoutEarlyVoting[],
    earlyVotingPayoutsModels: ResolveGameEvent[],
    playerActiveStaffers: IActiveStaffer[],
    passedGameModifiers: IPassedGameModifier[],
    gameClock: IGameClock,
    playerRid: IPlayerRid,
): Promise<number> {
    // Look for the according tally event with the active resolution rid
    const payoutForResolution = earlyVotingPayouts[0].onActiveResolutionRid;
    const accordingTallyEvent = await ResolveGameEvent.findOne({
        where: {
            gameStateRid,
            eventDetails: {
                activeResolutionRid: payoutForResolution,
                type: "tally-resolution",
            },
            state: "active",
        },
    });

    if (accordingTallyEvent == null) {
        return 0;
    }

    const modifier = getEarlyVotingBonusModifier(passedGameModifiers, playerActiveStaffers);
    const bonusPerVote = getEarlyVoteBonus(gameClock, accordingTallyEvent.resolvesOn) * modifier;

    const totalVotes = earlyVotingPayouts
        .map((vote) => {
            const accordingStaffer = playerActiveStaffers.find((s) => s.activeStafferRid === vote.activeStafferRid);
            if (accordingStaffer === undefined) {
                return 0;
            }

            return getTotalAllowedVotes(accordingStaffer.stafferDetails, passedGameModifiers);
        })
        .reduce((a, b) => a + b, 0);

    await Promise.all(
        earlyVotingPayoutsModels.map((event) => {
            event.state = "complete";
            return event.save();
        }),
    );

    const totalPaidOut = totalVotes * bonusPerVote;

    if (totalPaidOut > 0) {
        SendNotificationToPlayerQueue.add({
            gameStateRid,
            playerRid,
            notificationDetails: {
                type: "game-notification",
                message: `You earned ${_.round(totalPaidOut, 2)} political capital by voting ${
                    accordingTallyEvent.resolvesOn - gameClock
                } days early.${
                    modifier !== 1 ? ` ${_.round((modifier - 1) * 100, 2)}% modifier on amount earned.` : ""
                }`,
            },
            status: "read",
            createdOn: gameClock,
        });
    }

    return totalPaidOut;
}

async function handleStartHiringOrTraining(
    gameStateRid: IGameStateRid,
    activePlayer: IActivePlayer,
    startHiringOrTraining: Array<IStartHiringStaffer | IStartTrainingStaffer>,
    currentGameClock: IGameClock,
    startHiringOrTrainingModels: ResolveGameEvent[],
    activePlayerStaffers: ActiveStaffer[],
    passedGameModifiers: IPassedGameModifier[],
): Promise<number> {
    const totalCosts = await Promise.all(
        startHiringOrTraining.map(async (trainingOrHiring, index): Promise<number> => {
            const accordingModel = startHiringOrTrainingModels[index];
            accordingModel.state = "complete";

            if (IEvent.isStartHireStaffer(trainingOrHiring)) {
                const newStafferRid = crypto.randomUUID() as IActiveStafferRid;
                const newStafferDetails = getStafferOfType(trainingOrHiring.stafferType);

                const finalTimeToAcquire = getStafferAcquisitionTime(
                    newStafferDetails,
                    passedGameModifiers,
                    activePlayerStaffers,
                );

                await Promise.all([
                    ActiveStaffer.create({
                        gameStateRid,
                        playerRid: activePlayer.playerRid,
                        activeStafferRid: newStafferRid,
                        stafferDetails: newStafferDetails,
                        avatarSet: activePlayer.avatarSet,
                        state: "disabled",
                    }),
                    ResolveGameEvent.create({
                        gameStateRid,
                        resolvesOn: Math.round(currentGameClock + finalTimeToAcquire) as IGameClock,
                        eventDetails: {
                            playerRid: activePlayer.playerRid,
                            recruiterRid: trainingOrHiring.recruiterRid,
                            activeStafferRid: newStafferRid,
                            type: "finish-hiring-staffer",
                        },
                        state: "active",
                    }),
                    accordingModel.save(),
                ]);

                return getStafferAcquisitionCost(newStafferDetails, passedGameModifiers, activePlayerStaffers);
            }

            if (IEvent.isStartTrainingStaffer(trainingOrHiring)) {
                const newStafferDetails = DEFAULT_STAFFER[trainingOrHiring.toLevel];

                const existingStaffer = await ActiveStaffer.findOne({
                    where: { gameStateRid, activeStafferRid: trainingOrHiring.activeStafferRid },
                });

                const finalTimeToAcquire = getStafferAcquisitionTime(
                    newStafferDetails,
                    passedGameModifiers,
                    activePlayerStaffers,
                );

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
                        resolvesOn: Math.round(currentGameClock + finalTimeToAcquire) as IGameClock,
                        eventDetails: {
                            playerRid: activePlayer.playerRid,
                            trainerRid: trainingOrHiring.trainerRid,
                            activeStafferRid: trainingOrHiring.activeStafferRid,
                            type: "finish-training-staffer",
                        },
                        state: "active",
                    }),
                    accordingModel.save(),
                ]);

                return getStafferAcquisitionCost(newStafferDetails, passedGameModifiers, activePlayerStaffers);
            }

            return 0;
        }),
    );

    return totalCosts.reduce((previous, next) => previous + next, 0);
}

export async function handlePlayerProcessor(job: Job<IProcessPlayerQueue>, done: DoneCallback) {
    const { gameStateRid, playerRid, gameClock } = job.data;

    const [activePlayer, activePlayerStaffers, passedGameModifiers] = await Promise.all([
        ActivePlayer.findOne({ where: { gameStateRid, playerRid } }),
        ActiveStaffer.findAll({ where: { gameStateRid, playerRid } }),
        PassedGameModifier.findAll({ where: { gameStateRid } }),
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
            playerRid,
            gameClock,
            passedGameModifiers,
        );
        activePlayer.politicalCapital += isNaN(totalPayoutForPlayer) ? 0 : totalPayoutForPlayer;
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

    // Then handle any early voting payouts
    const earlyVotingPayouts = handleEventsForPlayer.filter((event) => IEvent.isPayoutEarlyVoting(event.eventDetails));
    if (earlyVotingPayouts.length > 0) {
        const deltaInPoliticalCapitalFromEarlyPayouts = await handleEarlyVotingPayouts(
            gameStateRid,
            earlyVotingPayouts.map((e) => e.eventDetails) as IPayoutEarlyVoting[],
            earlyVotingPayouts,
            activePlayerStaffers,
            passedGameModifiers,
            gameClock,
            playerRid,
        );
        activePlayer.politicalCapital += isNaN(deltaInPoliticalCapitalFromEarlyPayouts)
            ? 0
            : deltaInPoliticalCapitalFromEarlyPayouts;
    }

    // Then any payouts from staffers
    const deltaInPoliticalCapital = activePlayerStaffers
        .map((activeStaffer) => getTotalPayout(activeStaffer, passedGameModifiers))
        .reduce((previous, next) => previous + next, 0);
    activePlayer.politicalCapital += isNaN(deltaInPoliticalCapital) ? 0 : deltaInPoliticalCapital;

    // And finally start any trainings or hirings
    const startHiringOrTraining = handleEventsForPlayer.filter(
        (event) => IEvent.isStartHireStaffer(event.eventDetails) || IEvent.isStartTrainingStaffer(event.eventDetails),
    );
    if (startHiringOrTraining.length > 0) {
        const deltaInPoliticalCapitalFromHiringAndTraining = await handleStartHiringOrTraining(
            gameStateRid,
            activePlayer,
            startHiringOrTraining.map((event) => event.eventDetails) as Array<
                IStartHiringStaffer | IStartTrainingStaffer
            >,
            gameClock,
            startHiringOrTraining,
            activePlayerStaffers,
            passedGameModifiers,
        );
        activePlayer.politicalCapital -= isNaN(deltaInPoliticalCapitalFromHiringAndTraining)
            ? 0
            : deltaInPoliticalCapitalFromHiringAndTraining;
    }

    // Each process would have updated the total political capital of the player, so we'll need to save
    activePlayer.lastUpdatedGameClock = gameClock;
    await activePlayer.save();

    UpdatePlayerQueue.add({ gameStateRid: job.data.gameStateRid, gameClock });
    done();
}

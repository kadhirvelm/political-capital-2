/**
 * Copyright (c) 2022 - KM
 */

import { BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER } from "../constants/game";
import { IGameModifier } from "./IGameModifier";

export interface IBasicResolution {
    title: string;
    description: string;
    /** This is the total political capital payout per player in the game. */
    politicalCapitalPayout: number;
    gameModifier?: IGameModifier;
    stage: "early" | "middle" | "late";
}

type IOmitStaged = Omit<IBasicResolution, "stage">;

// Robots, Monsters, Cats, Humans

const EARLY: IOmitStaged[] = [
    {
        title: "Robots require rain",
        description:
            "The coalition of robots think their part of the metropolis doesn't get enough rain. They'd like to petition for more rain.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            effectiveness: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            costToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["voter"],
            costToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["voter"],
            timeToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["recruit"],
            timeToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["recruit"],
            costToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["trainer"],
            timeToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["trainer"],
            costToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["shadowGovernment"],
            costToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["shadowGovernment"],
            timeToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    },
];

const MIDDLE: IOmitStaged[] = [
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 0.8,
        gameModifier: {
            payoutPerResolution: 0.2,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 1.2,
        gameModifier: {
            payoutPerResolution: -0.2,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            payoutPerPlayer: 0.2,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            payoutPerPlayer: -0.2,
            type: "resolution-effect",
        },
    },
    {
        title: "Too many decisions",
        description:
            "This government is making too many decision too quickly. We need to slow down before we do something stupid. The time increase might remove the last resolution.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            timeBetweenResolutions: 0.3,
            type: "resolution-effect",
        },
    },
    {
        title: "Pass all the resolutions",
        description:
            "We need to look like we're working hard to keep these nice jobs. The increased speed might accommodate one more resolution.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            timeBetweenResolutions: -0.3,
            timePerResolution: -0.3,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            earlyVotingBonus: 0.15,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            earlyVotingBonus: -0.1,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            costToAcquire: -0.2,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            costToAcquire: 0.15,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            timeToAcquire: 0.15,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            timeToAcquire: -0.2,
            type: "staffer-effect",
        },
    },
];

const LATE: IOmitStaged[] = [
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["voter"],
            effectiveness: 0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            effectiveness: 0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            timeToAcquire: -0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["recruit"],
            costToAcquire: -0.75,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["trainer"],
            costToAcquire: -0.75,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["shadowGovernment"],
            timeToAcquire: -0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            earlyVotingBonus: 0.25,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            payoutPerResolution: 0.25,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["voter"],
            disableHiring: true,
            disableTraining: true,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            disableHiring: true,
            disableTraining: true,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["recruit"],
            disableHiring: true,
            disableTraining: true,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["trainer"],
            disableHiring: true,
            disableTraining: true,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["shadowGovernment"],
            disableHiring: true,
            disableTraining: true,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 1.5,
    },
];

export const ALL_RESOLUTIONS: IBasicResolution[] = [
    ...EARLY.map((r) => ({ ...r, stage: "early" as const })),
    ...MIDDLE.map((r) => ({ ...r, stage: "middle" as const })),
    ...LATE.map((r) => ({ ...r, stage: "late" as const })),
];

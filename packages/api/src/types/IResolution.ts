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

const EARLY: IOmitStaged[] = [
    {
        title: "Robots require rain",
        description:
            "The coalition of robots think their part of the metropolis doesn't get enough rain. They'd like to use the generators to petition for more.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            effectiveness: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "The swamp industry is taking over",
        description:
            "Big swamp wants to lower regulatory standards on what is a 'cookie.' Unfortunately they pay well for marketing positions.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            costToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Kittens 'R Us",
        description:
            "The conglomerate of cats needs more representation. They want to provide tax incentives for cat families to have more kittens.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["voter"],
            costToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "The noisy neighbors",
        description:
            "The neighboring sentient tree civilization keeps sending delegates to howl at us. Should we send some representatives to howl back?",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["voter"],
            timeToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Everyone needs public transport",
        description:
            "Should we increase the funding for public transport to the outer reaches of the metropolis, allowing more citizens to come to the capital? Do we want that kind of citizen here?",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["recruit"],
            timeToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Increase the minimum anchovy",
        description:
            "The cats think the anchovies in the metropolis are too small. We should increase regulation requiring a higher minimum anchovy. Anchovy? Sorry we meant minimum wage.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["recruit"],
            costToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Lower robot power requirements",
        description:
            "Young robots don't have the same opportunities the previous generations had. This removes the requirement for new generation robots to have phone chargers installed.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["trainer"],
            timeToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "The monsters pay too much",
        description:
            "The union of monsters has been paying top dollar for educators. This will add 2 toilet paper rolls and 1 banana as a signing bonus for educators that join the government.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["trainer"],
            costToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "The shadows are moving",
        description:
            "It seems the shadow government REDACTED. REDACTED. REDACTED. Therefore, this gives them the bananas they request.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["shadowGovernment"],
            costToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Lights everywhere",
        description:
            "In order to combat the shadow government, this adds more flood lights to the city, shining a light on all the seedy activity. That should slow it down.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["shadowGovernment"],
            timeToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Let's be happy",
        description:
            "The government thinks everyone is working too hard. This makes the popular swamp hard seltzer a public good.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            timeToAcquire: 0.1,
            costToAcquire: -0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Everyone needs to work",
        description: "GET TO WORK, IMMEDIATELY. No more milk breaks, get back to work!",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            timeToAcquire: -0.1,
            costToAcquire: 0.1,
            type: "staffer-effect",
        },
    },
    {
        title: "Rename the official sports team",
        description:
            "After much debate, this proposes renaming the national sports team from 'The scary citizens' to 'The kind of nice citizens'.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 1.2,
    },
];

const MIDDLE: IOmitStaged[] = [
    {
        title: "Under construction 5",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["voter"],
            effectiveness: 0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 6",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["voter"],
            timeToAcquire: 1,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 7",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            effectiveness: 0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 8",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["generator"],
            timeToAcquire: 0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 9",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["recruit"],
            costToAcquire: -0.75,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 10",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["recruit"],
            timeToAcquire: 0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 11",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["trainer"],
            costToAcquire: -0.75,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 12",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["trainer"],
            timeToAcquire: 0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 13",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["shadowGovernment"],
            timeToAcquire: -0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 14",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["shadowGovernment"],
            costToAcquire: 0.5,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 15",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            earlyVotingBonus: 0.25,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction 16",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            earlyVotingBonus: -0.25,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction 17",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            payoutPerResolution: 0.25,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction 18",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            payoutPerResolution: -0.25,
            type: "resolution-effect",
        },
    },
    {
        title: "Under construction 19",
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
        title: "Under construction 20",
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
        title: "Under construction 21",
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
        title: "Under construction 22",
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
        title: "Under construction 23",
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
        title: "Under construction 24",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 3,
    },
];

const LATE: IOmitStaged[] = [
    {
        title: "Put the government on social media",
        description:
            "The freshly minted voters don't find us relatable. This puts the government on the popular SwampTok, that should fix the problem.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 0.8,
        gameModifier: {
            payoutPerResolution: 0.2,
            type: "resolution-effect",
        },
    },
    {
        title: "Restrict government propaganda",
        description:
            "We've had too many viral videos on SwampTok. People are paying too much attention. This cuts our social media presence back.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 1.2,
        gameModifier: {
            payoutPerResolution: -0.2,
            type: "resolution-effect",
        },
    },
    {
        title: "The rich need to help",
        description:
            "The elite of the metropolis aren't paying attention to us. This increases the allowed political donation cap.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            payoutPerPlayer: 0.2,
            type: "resolution-effect",
        },
    },
    {
        title: "The rich need to leave",
        description:
            "The elite of the metropolis have their hands in everything, especially the cookies. We need our snacks back. This limits the intervention of the rich in government affairs.",
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
        title: "Swamp Industries wants you to vote",
        description:
            "Swamp Industries is offering to add a little something extra when representatives do their job. This allows their altruism to go unchecked.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            earlyVotingBonus: 0.15,
            type: "resolution-effect",
        },
    },
    {
        title: "Swamp Industries needs dividends",
        description:
            "Swamp Industries has come to collect from the government. This starts the painful process of paying back the bailout we took from them.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            earlyVotingBonus: -0.1,
            type: "resolution-effect",
        },
    },
    {
        title: "Open the floodgates",
        description:
            "This increases the public education budget, getting the funding from the public sanitation fund and the handicapped veterans institute.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            costToAcquire: -0.2,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 1",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            costToAcquire: 0.15,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 2",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            timeToAcquire: 0.15,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 3",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
        gameModifier: {
            staffersAffected: ["everyone"],
            timeToAcquire: -0.2,
            type: "staffer-effect",
        },
    },
    {
        title: "Under construction 4",
        description: "Under construction",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 1.6,
    },
];

export const ALL_RESOLUTIONS: IBasicResolution[] = [
    ...EARLY.map((r) => ({ ...r, stage: "early" as const })),
    ...MIDDLE.map((r) => ({ ...r, stage: "middle" as const })),
    ...LATE.map((r) => ({ ...r, stage: "late" as const })),
];

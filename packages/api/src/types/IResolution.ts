/*
 * Copyright 2023 KM.
 */

import { BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER } from "../constants/game";
import { type IGameModifier } from "./IGameModifier";

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
    description:
      "The coalition of robots think their part of the metropolis doesn't get enough rain. They'd like to use the generators to petition for more.",
    gameModifier: {
      effectiveness: 0.1,
      staffersAffected: ["generator"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Robots require rain",
  },
  {
    description:
      "Big swamp wants to lower regulatory standards on what is a 'cookie.' Unfortunately they pay well for marketing positions.",
    gameModifier: {
      costToAcquire: 0.1,
      staffersAffected: ["generator"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "The swamp industry is taking over",
  },
  {
    description:
      "The conglomerate of cats needs more representation. They want to provide tax incentives for cat families to have more kittens.",
    gameModifier: {
      costToAcquire: -0.1,
      staffersAffected: ["voter"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Kittens 'R Us",
  },
  {
    description:
      "The neighboring sentient tree civilization keeps sending delegates to howl at us. Should we send some representatives to howl back?",
    gameModifier: {
      staffersAffected: ["voter"],
      timeToAcquire: 0.1,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "The noisy neighbors",
  },
  {
    description:
      "Should we increase the funding for public transport to the outer reaches of the metropolis, allowing more citizens to come to the capital? Do we want that kind of citizen here?",
    gameModifier: {
      staffersAffected: ["recruit"],
      timeToAcquire: -0.1,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Everyone needs public transport",
  },
  {
    description:
      "The cats think the anchovies in the metropolis are too small. We should increase regulation requiring a higher minimum anchovy. Anchovy? Sorry we meant minimum wage.",
    gameModifier: {
      costToAcquire: 0.1,
      staffersAffected: ["recruit"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Increase the minimum anchovy",
  },
  {
    description:
      "Young robots don't have the same opportunities the previous generations had. This removes the requirement for new generation robots to have phone chargers installed.",
    gameModifier: {
      staffersAffected: ["trainer"],
      timeToAcquire: -0.1,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Lower robot power requirements",
  },
  {
    description:
      "The union of monsters has been paying top dollar for educators. This will add 2 toilet paper rolls and 1 banana as a signing bonus for educators that join the government.",
    gameModifier: {
      costToAcquire: 0.1,
      staffersAffected: ["trainer"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "The monsters pay too much",
  },
  {
    description:
      "It seems the shadow government REDACTED. REDACTED. REDACTED. Therefore, this gives them the bananas they request.",
    gameModifier: {
      costToAcquire: -0.1,
      staffersAffected: ["shadowGovernment"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "The shadows are moving",
  },
  {
    description:
      "In order to combat the shadow government, this adds more flood lights to the city, shining a light on all the seedy activity. That should slow it down.",
    gameModifier: {
      staffersAffected: ["shadowGovernment"],
      timeToAcquire: 0.1,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Lights everywhere",
  },
  {
    description:
      "The government thinks everyone is working too hard. This makes the popular swamp hard seltzer a public good.",
    gameModifier: {
      costToAcquire: -0.1,
      staffersAffected: ["everyone"],
      timeToAcquire: 0.1,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Let's be happy",
  },
  {
    description: "GET TO WORK, IMMEDIATELY. No more milk breaks, get back to work!",
    gameModifier: {
      costToAcquire: 0.1,
      staffersAffected: ["everyone"],
      timeToAcquire: -0.1,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Everyone needs to work",
  },
  {
    description:
      "After much debate, this proposes renaming the national sports team from 'The scary citizens' to 'The kind of nice citizens'.",
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 1.2,
    title: "Rename the official sports team",
  },
];

const MIDDLE: IOmitStaged[] = [
  {
    description: "Under construction",
    gameModifier: {
      effectiveness: 0.5,
      staffersAffected: ["voter"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 5",
  },
  {
    description: "Under construction",
    gameModifier: {
      staffersAffected: ["voter"],
      timeToAcquire: 1,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 6",
  },
  {
    description: "Under construction",
    gameModifier: {
      effectiveness: 0.5,
      staffersAffected: ["generator"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 7",
  },
  {
    description: "Under construction",
    gameModifier: {
      staffersAffected: ["generator"],
      timeToAcquire: 0.5,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 8",
  },
  {
    description: "Under construction",
    gameModifier: {
      costToAcquire: -0.75,
      staffersAffected: ["recruit"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 9",
  },
  {
    description: "Under construction",
    gameModifier: {
      staffersAffected: ["recruit"],
      timeToAcquire: 0.5,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 10",
  },
  {
    description: "Under construction",
    gameModifier: {
      costToAcquire: -0.75,
      staffersAffected: ["trainer"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 11",
  },
  {
    description: "Under construction",
    gameModifier: {
      staffersAffected: ["trainer"],
      timeToAcquire: 0.5,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 12",
  },
  {
    description: "Under construction",
    gameModifier: {
      staffersAffected: ["shadowGovernment"],
      timeToAcquire: -0.5,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 13",
  },
  {
    description: "Under construction",
    gameModifier: {
      costToAcquire: 0.5,
      staffersAffected: ["shadowGovernment"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 14",
  },
  {
    description: "Under construction",
    gameModifier: {
      earlyVotingBonus: 0.25,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 15",
  },
  {
    description: "Under construction",
    gameModifier: {
      earlyVotingBonus: -0.25,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 16",
  },
  {
    description: "Under construction",
    gameModifier: {
      payoutPerResolution: 0.25,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 17",
  },
  {
    description: "Under construction",
    gameModifier: {
      payoutPerResolution: -0.25,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 18",
  },
  {
    description: "Under construction",
    gameModifier: {
      disableHiring: true,
      disableTraining: true,
      staffersAffected: ["voter"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 19",
  },
  {
    description: "Under construction",
    gameModifier: {
      disableHiring: true,
      disableTraining: true,
      staffersAffected: ["generator"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 20",
  },
  {
    description: "Under construction",
    gameModifier: {
      disableHiring: true,
      disableTraining: true,
      staffersAffected: ["recruit"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 21",
  },
  {
    description: "Under construction",
    gameModifier: {
      disableHiring: true,
      disableTraining: true,
      staffersAffected: ["trainer"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 22",
  },
  {
    description: "Under construction",
    gameModifier: {
      disableHiring: true,
      disableTraining: true,
      staffersAffected: ["shadowGovernment"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 23",
  },
  {
    description: "Under construction",
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 3,
    title: "Under construction 24",
  },
];

const LATE: IOmitStaged[] = [
  {
    description:
      "The freshly minted voters don't find us relatable. This puts the government on the popular SwampTok, that should fix the problem.",
    gameModifier: {
      payoutPerResolution: 0.2,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 0.8,
    title: "Put the government on social media",
  },
  {
    description:
      "We've had too many viral videos on SwampTok. People are paying too much attention. This cuts our social media presence back.",
    gameModifier: {
      payoutPerResolution: -0.2,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 1.2,
    title: "Restrict government propaganda",
  },
  {
    description:
      "The elite of the metropolis aren't paying attention to us. This increases the allowed political donation cap.",
    gameModifier: {
      payoutPerPlayer: 0.2,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "The rich need to help",
  },
  {
    description:
      "The elite of the metropolis have their hands in everything, especially the cookies. We need our snacks back. This limits the intervention of the rich in government affairs.",
    gameModifier: {
      payoutPerPlayer: -0.2,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "The rich need to leave",
  },
  {
    description:
      "This government is making too many decision too quickly. We need to slow down before we do something stupid. The time increase might remove the last resolution.",
    gameModifier: {
      timeBetweenResolutions: 0.3,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Too many decisions",
  },
  {
    description:
      "We need to look like we're working hard to keep these nice jobs. The increased speed might accommodate one more resolution.",
    gameModifier: {
      timeBetweenResolutions: -0.3,
      timePerResolution: -0.3,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Pass all the resolutions",
  },
  {
    description:
      "Swamp Industries is offering to add a little something extra when representatives do their job. This allows their altruism to go unchecked.",
    gameModifier: {
      earlyVotingBonus: 0.15,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Swamp Industries wants you to vote",
  },
  {
    description:
      "Swamp Industries has come to collect from the government. This starts the painful process of paying back the bailout we took from them.",
    gameModifier: {
      earlyVotingBonus: -0.1,
      type: "resolution-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Swamp Industries needs dividends",
  },
  {
    description:
      "This increases the public education budget, getting the funding from the public sanitation fund and the handicapped veterans institute.",
    gameModifier: {
      costToAcquire: -0.2,
      staffersAffected: ["everyone"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Open the floodgates",
  },
  {
    description: "Under construction",
    gameModifier: {
      costToAcquire: 0.15,
      staffersAffected: ["everyone"],
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 1",
  },
  {
    description: "Under construction",
    gameModifier: {
      staffersAffected: ["everyone"],
      timeToAcquire: 0.15,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 2",
  },
  {
    description: "Under construction",
    gameModifier: {
      staffersAffected: ["everyone"],
      timeToAcquire: -0.2,
      type: "staffer-effect",
    },
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    title: "Under construction 3",
  },
  {
    description: "Under construction",
    politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 1.6,
    title: "Under construction 4",
  },
];

export const ALL_RESOLUTIONS: IBasicResolution[] = [
  ...EARLY.map((r) => ({ ...r, stage: "early" as const })),
  ...MIDDLE.map((r) => ({ ...r, stage: "middle" as const })),
  ...LATE.map((r) => ({ ...r, stage: "late" as const })),
];

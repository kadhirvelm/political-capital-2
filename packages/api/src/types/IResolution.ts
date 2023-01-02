/**
 * Copyright (c) 2022 - KM
 */

import { IGameModifier } from "./IGameModifier";

export interface IBasicResolution {
    title: string;
    description: string;
    politicalCapitalPayout: number;
    gameModifier?: IGameModifier;
    stage: "all" | "early" | "middle" | "late";
}

const ALL: IBasicResolution[] = [
    {
        title: "Nationalization to the max",
        description:
            "In an effort to grow stagnating growth in the media industry, this lessens the restrictions on the political content allowed on national television.",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["independentRepresentative"],
            disableTraining: true,
        },
        stage: "all",
    },
    {
        title: "Increase phone banking regulation",
        description:
            "In an effort to reduce spam calls to the people, this would increase the regulations on phone bankers.",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["phoneBanker"],
            effectiveness: -0.5,
        },
        stage: "all",
    },
    {
        title: "Wars are profitable",
        description: "The political elite want to start a war with a neighboring country, but nobody is too sure why.",
        politicalCapitalPayout: 25,
        stage: "all",
    },
];

const EARLY: IBasicResolution[] = [
    {
        title: "The people demand change",
        description: "The people are demanding change in the government and are turning to new voices.",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["representative"],
            effectiveness: 1,
        },
        stage: "early",
    },
    {
        title: "More money for cookies",
        description:
            "After waves of historic natural disasters rock the country, the people want to see the government taking charge. Specifically, they want to see more chocolate chip cookies in the capital building.",
        politicalCapitalPayout: 10,
        stage: "early",
    },
    {
        title: "Trainers represent",
        description:
            "The citizens of other countries seem to be more educated than us. We should do something about that.",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["trainer"],
            effectiveness: 0.5,
        },
        stage: "early",
    },
    {
        title: "Political propaganda",
        description: "We need to get the message out! What message you ask? Don't.",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["generator"],
            effectiveness: 0.5,
        },
        stage: "early",
    },
];

const MIDDLE: IBasicResolution[] = [
    {
        title: "The people demand jobs",
        description: "Funding allocation to low level labor making them easier to acquire.",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["intern", "phoneBanker", "recruit", "partTimeInstructor"],
            costToAcquire: -0.15,
            timeToAcquire: -0.15,
        },
        stage: "middle",
    },
    {
        title: "Less political propaganda",
        description: "Too many messages going out from the government, we should slow down",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["generator"],
            effectiveness: -0.25,
        },
        stage: "middle",
    },
    {
        title: "More blue collar",
        description: "The citizens in this country are too educated, we can't related to the rest of the world.",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["trainer"],
            effectiveness: -0.5,
        },
        stage: "middle",
    },
    {
        title: "Economic stimulus",
        description: "To prevent an economic collapse, we're going to pump money like never before",
        politicalCapitalPayout: 10,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["everyone"],
            costToAcquire: -0.15,
        },
        stage: "middle",
    },
    {
        title: "So much inflation",
        description: "We pumped too much money, we need to get this inflation under control. What were we thinking?",
        politicalCapitalPayout: 10,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["everyone"],
            costToAcquire: 0.15,
        },
        stage: "middle",
    },
];

const LATE: IBasicResolution[] = [
    {
        title: "Gun control",
        description: "Seems like a sensible thing to do, right?",
        politicalCapitalPayout: 30,
        stage: "late",
    },
    {
        title: "Elections around the corner",
        description:
            "Decreases regulation around campaigning, making it easier for politicians to get their message out",
        politicalCapitalPayout: 10,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["generator"],
            effectiveness: 2,
        },
        stage: "late",
    },
    {
        title: "Tightening the belt",
        description: "We've spent way too much money, we need to severely cut back",
        politicalCapitalPayout: 10,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["everyone"],
            costToAcquire: 0.5,
        },
        stage: "late",
    },
    {
        title: "More people, less problems",
        description: "We should try to employ more people, that should be popular with the voters",
        politicalCapitalPayout: 10,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["everyone"],
            costToAcquire: -0.5,
        },
        stage: "late",
    },
];

export const ALL_RESOLUTIONS: IBasicResolution[] = [...ALL, ...EARLY, ...MIDDLE, ...LATE];

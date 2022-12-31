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
        politicalCapitalPayout: 10,
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
        politicalCapitalPayout: 10,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["phoneBanker"],
            effectiveness: -0.5,
        },
        stage: "all",
    },
];

const EARLY: IBasicResolution[] = [
    {
        title: "The people demand change",
        description: "The people are demanding change in the government and are turning to new voices.",
        politicalCapitalPayout: 10,
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
        politicalCapitalPayout: 3,
        stage: "early",
    },
];

const MIDDLE: IBasicResolution[] = [
    {
        title: "The people demand jobs",
        description: "Funding allocation to low level labor making them easier to acquire.",
        politicalCapitalPayout: 10,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["intern", "phoneBanker", "recruit", "partTimeInstructor"],
            costToAcquire: -0.25,
            timeToAcquire: -0.25,
        },
        stage: "middle",
    },
];

const LATE: IBasicResolution[] = [
    {
        title: "Gun control",
        description: "Seems like a sensible thing to do, right?",
        politicalCapitalPayout: 20,
        stage: "late",
    },
    {
        title: "Elections around the corner",
        description:
            "Decreases regulation around campaigning, making it easier for politicians to get their message out",
        politicalCapitalPayout: 5,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["generator"],
            effectiveness: 2,
        },
        stage: "late",
    },
];

export const ALL_RESOLUTIONS: IBasicResolution[] = [...ALL, ...EARLY, ...MIDDLE, ...LATE];

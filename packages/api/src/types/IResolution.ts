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

export const ALL_RESOLUTIONS: IBasicResolution[] = [
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

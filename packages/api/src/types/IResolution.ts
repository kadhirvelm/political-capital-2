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
        title: "National pride",
        description:
            "In an effort to revitalize a stagnating media industry, this lessens the restrictions on the political content allowed on national television.",
        politicalCapitalPayout: 20,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["independentRepresentative", "independentSenator"],
            disableTraining: true,
        },
        stage: "all",
    },
    {
        title: "Increase phone banking regulation",
        description:
            "In an effort to reduce spam calls to the citizens, this would increase the regulations on phone bankers.",
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
    {
        title: "The monsters need scones",
        description: "Modern medicine has allowed the monsters to taste sugar for the first time. They demand scones.",
        politicalCapitalPayout: 25,
        stage: "all",
    },
    {
        title: "Anchovies and milk for all",
        description:
            "The cat representatives think there's a particular lack of access to anchovies and milk. It should be fixed.",
        politicalCapitalPayout: 25,
        stage: "all",
    },
    {
        title: "The robots and phone chargers",
        description:
            "Tired of informing the other representatives how offensive it is to be asked to charge their phones, the robots demand more phone charging stations around the capital building. It's basic robot deceny.",
        politicalCapitalPayout: 25,
        stage: "all",
    },
];

const EARLY: IBasicResolution[] = [
    {
        title: "The citizens demand change",
        description: "The citizens are demanding change in the government and are turning to new voices.",
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
            "After waves of historic natural disasters rock the country, the citizens want to see the government taking charge. Specifically, they want to see more chocolate chip cookies. Or was it water and power? No, it was cookies...probably?",
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
        title: "The citizens demand jobs",
        description:
            "Funding allocation to low level labor makes them easier to acquire. We can take some money away from the public clown schools to fund this.",
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
        description:
            "Too many messages going out from the government, we should slow down. The citizens might start to believe us.",
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
        description:
            "The citizens in this country are too educated, we can't relate to the rest of the world. Let's dumb ourselves down a bit.",
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
        description:
            "To prevent an economic collapse, we're going to pump money like never before. You want a dollar? Here's 10!",
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
        description:
            "Okay, we pumped too much money, we need to get this inflation under control. $75 for a candy bar seems a little high. But it could be worth it?",
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
        description:
            "Seems like a sensible thing to do, right? Though the robots and monsters don't seem to care much.",
        politicalCapitalPayout: 30,
        stage: "late",
    },
    {
        title: "Elections around the corner",
        description:
            "Decreases regulation around campaigning, making it easier for politicians to get their message out. Is this a good thing?",
        politicalCapitalPayout: 15,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["generator"],
            effectiveness: 1.5,
        },
        stage: "late",
    },
    {
        title: "Tightening the belt",
        description: "We've spent way too much money, we need to severely cut back",
        politicalCapitalPayout: 15,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["everyone"],
            costToAcquire: 0.5,
        },
        stage: "late",
    },
    {
        title: "More citizens, less problems",
        description:
            "We should try to employ more citizens, that should be popular with the voters. Oh the rich people don't like that?",
        politicalCapitalPayout: 15,
        gameModifier: {
            type: "staffer-effect",
            staffersAffected: ["everyone"],
            costToAcquire: -0.5,
        },
        stage: "late",
    },
    {
        title: "Elect a speaker of the house..?",
        description:
            "Before we can elect a speaker of the house, we should decide if we want to elect a speaker of the house in the first place. It could bring much needed stability, but chaos seems fun too.",
        politicalCapitalPayout: 30,
        stage: "late",
    },
];

export const ALL_RESOLUTIONS: IBasicResolution[] = [...ALL, ...EARLY, ...MIDDLE, ...LATE];

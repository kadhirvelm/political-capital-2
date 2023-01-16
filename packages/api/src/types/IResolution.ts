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

// Robots, Monsters, Cats, Humans

const EARLY: IBasicResolution[] = [
    {
        title: "Robots require rain",
        description:
            "The coalition of robots think their part of the metropolis doesn't get enough rain. They'd like to allocate funding to petition for more rain.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    },
].map((r) => ({ ...r, stage: "early" }));

const MIDDLE: IBasicResolution[] = [
    {
        title: "Robots require rain",
        description:
            "The coalition of robots think their part of the metropolis doesn't get enough rain. They'd like to allocate funding to petition for more rain.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    },
].map((r) => ({ ...r, stage: "middle" }));

const LATE: IBasicResolution[] = [
    {
        title: "Robots require rain",
        description:
            "The coalition of robots think their part of the metropolis doesn't get enough rain. They'd like to allocate funding to petition for more rain.",
        politicalCapitalPayout: BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    },
].map((r) => ({ ...r, stage: "late" }));

export const ALL_RESOLUTIONS: IBasicResolution[] = [...EARLY, ...MIDDLE, ...LATE];

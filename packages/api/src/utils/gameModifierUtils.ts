/**
 * Copyright (c) 2022 - KM
 */

import { IStafferEffect } from "../types/IGameModifier";
import { IPassedGameModifier } from "../types/politicalCapitalTwo";
import { getStafferDetails, IActiveOrPossibleStaffer, isGenerator, isRecruit, isTrainer, isVoter } from "./staffer";

export function isStafferInCategory(
    activeStaffer: IActiveOrPossibleStaffer,
    category: IStafferEffect["staffersAffected"][number],
) {
    const stafferDetails = getStafferDetails(activeStaffer);

    if (category === "everyone") {
        return true;
    }

    if (category === stafferDetails.type) {
        return true;
    }

    if (category === "voter" && isVoter(stafferDetails)) {
        return true;
    }

    if (category === "generator" && isGenerator(stafferDetails)) {
        return true;
    }

    if (category === "recruit" && isRecruit(stafferDetails)) {
        return true;
    }

    if (category === "trainer" && isTrainer(stafferDetails)) {
        return true;
    }

    return false;
}

export function getRelevantModifiersToStaffer(
    allPassedGameModifiers: IPassedGameModifier[],
    activeStaffer: IActiveOrPossibleStaffer,
): IPassedGameModifier[] {
    return allPassedGameModifiers.filter(({ modifier }) => {
        if (modifier.type === "resolution-effect") {
            return false;
        }

        return modifier.staffersAffected.some((category) => isStafferInCategory(activeStaffer, category));
    });
}

function getStafferModifier(
    modifierKey: "costToAcquire" | "timeToAcquire" | "effectiveness",
    allPassedGameModifiers: IPassedGameModifier[],
    activeStaffer: IActiveOrPossibleStaffer | undefined,
): number {
    if (activeStaffer === undefined) {
        return 1;
    }

    const allRelevantModifiers = getRelevantModifiersToStaffer(allPassedGameModifiers, activeStaffer)
        .slice()
        .sort((a, b) => (a.createdOn > b.createdOn ? 1 : -1));

    let newMultiplier = 1;
    allRelevantModifiers.forEach(({ modifier }) => {
        if (modifier.type === "resolution-effect") {
            return;
        }

        const thisModifierValue = modifier[modifierKey] ?? 0;
        // This gets us the number we want to change by
        const changeInModifier = Math.abs(thisModifierValue) * newMultiplier;
        // And this sets it in the direction we want
        newMultiplier = thisModifierValue > 0 ? newMultiplier + changeInModifier : newMultiplier - changeInModifier;
    });

    return Math.max(newMultiplier, 0);
}

export function getCostToAcquireModifier(
    allPassedGameModifiers: IPassedGameModifier[],
    activeStaffer: IActiveOrPossibleStaffer | undefined,
): number {
    return getStafferModifier("costToAcquire", allPassedGameModifiers, activeStaffer);
}

export function getTimeToAcquireModifier(
    allPassedGameModifiers: IPassedGameModifier[],
    activeStaffer: IActiveOrPossibleStaffer | undefined,
): number {
    return getStafferModifier("timeToAcquire", allPassedGameModifiers, activeStaffer);
}

export function getEffectivenessModifier(
    allPassedGameModifiers: IPassedGameModifier[],
    activeStaffer: IActiveOrPossibleStaffer | undefined,
): number {
    return getStafferModifier("effectiveness", allPassedGameModifiers, activeStaffer);
}

function getDisabledStaffers(
    modifierKey: "disableHiring" | "disableTraining",
    allPassedGameModifiers: IPassedGameModifier[],
) {
    const disabledStaffers: IStafferEffect["staffersAffected"][number][] = [];

    allPassedGameModifiers.forEach(({ modifier }) => {
        if (modifier.type === "resolution-effect") {
            return;
        }

        if (modifier[modifierKey] !== true) {
            return;
        }

        disabledStaffers.push(...modifier.staffersAffected);
    });

    return disabledStaffers;
}

export function isStafferHiringDisabled(
    allPassedGameModifiers: IPassedGameModifier[],
    staffer: IActiveOrPossibleStaffer,
) {
    const disabledStaffers = getDisabledStaffers("disableHiring", allPassedGameModifiers);
    return disabledStaffers.some((category) => isStafferInCategory(staffer, category));
}

export function isStafferTrainingDisabled(
    allPassedGameModifiers: IPassedGameModifier[],
    staffer: IActiveOrPossibleStaffer,
) {
    const disabledStaffers = getDisabledStaffers("disableTraining", allPassedGameModifiers);
    return disabledStaffers.some((category) => isStafferInCategory(staffer, category));
}

function getResolutionModifier(
    modifierKey: "timePerResolution" | "timeBetweenResolutions" | "payoutPerResolution",
    allPassedGameModifiers: IPassedGameModifier[],
) {
    const relevantModifiers = allPassedGameModifiers
        .filter((modifier) => modifier.modifier.type === "resolution-effect")
        .slice()
        .sort((a, b) => (a.createdOn > b.createdOn ? 1 : -1));

    let newMultiplier = 1;
    relevantModifiers.forEach(({ modifier }) => {
        if (modifier.type === "staffer-effect") {
            return;
        }

        const thisModifierValue = modifier[modifierKey] ?? 0;
        // This gets us the number we want to change by
        const changeInModifier = Math.abs(thisModifierValue) * newMultiplier;
        // And this sets it in the direction we want
        newMultiplier = thisModifierValue > 0 ? newMultiplier + changeInModifier : newMultiplier - changeInModifier;
    });

    return Math.max(newMultiplier, 0);
}

export function getTimePerResolutionModifier(allPassedGameModifiers: IPassedGameModifier[]) {
    return getResolutionModifier("timePerResolution", allPassedGameModifiers);
}

export function getTimeBetweenResolutionsModifier(allPassedGameModifiers: IPassedGameModifier[]) {
    return getResolutionModifier("timePerResolution", allPassedGameModifiers);
}

export function getPayoutPerResolutionModifier(allPassedGameModifiers: IPassedGameModifier[]) {
    return getResolutionModifier("timePerResolution", allPassedGameModifiers);
}

/*
 * Copyright 2023 KM.
 */

import { LOBBYIST_MODIFIER } from "../constants/game";
import { type IGameClock } from "../types/BrandedIDs";
import { type IStafferCategory, type IStafferEffect } from "../types/IGameModifier";
import {
  type IActivePlayerModifier,
  type IActiveStaffer,
  type IPassedGameModifier,
} from "../types/politicalCapitalTwo";
import {
  getStafferDetails,
  type IActiveOrPossibleStaffer,
  isGenerator,
  isRecruit,
  isShadowGovernment,
  isTrainer,
  isVoter,
} from "./staffer";

const STAFFER_EFFECT = "resolution-effect";

export function getStafferCategory(stafferDetails: IActiveOrPossibleStaffer): IStafferCategory | undefined {
  if (isVoter(stafferDetails)) {
    return "voter";
  }

  if (isGenerator(stafferDetails)) {
    return "generator";
  }

  if (isTrainer(stafferDetails)) {
    return "trainer";
  }

  if (isRecruit(stafferDetails)) {
    return "recruit";
  }

  if (isShadowGovernment(stafferDetails)) {
    return "shadowGovernment";
  }

  return undefined;
}

function isStafferInCategory(
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

  return category === "shadowGovernment" && isShadowGovernment(stafferDetails);
}

function getRelevantModifiersToStaffer(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  activeStaffer: IActiveOrPossibleStaffer,
): Array<IPassedGameModifier | IActivePlayerModifier> {
  return allPassedGameModifiers.filter(({ modifier }) => {
    if (modifier.type === STAFFER_EFFECT) {
      return false;
    }

    return modifier.staffersAffected.some((category) => isStafferInCategory(activeStaffer, category));
  });
}

function getStafferModifier(
  modifierKey: "costToAcquire" | "timeToAcquire" | "effectiveness",
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  activeStaffer: IActiveOrPossibleStaffer | undefined,
): number {
  if (activeStaffer === undefined) {
    return 1;
  }

  const allRelevantModifiers = [...getRelevantModifiersToStaffer(allPassedGameModifiers, activeStaffer)].sort((a, b) =>
    a.createdOn > b.createdOn ? 1 : -1,
  );

  let newMultiplier = 1;
  for (const { modifier } of allRelevantModifiers) {
    if (modifier.type === STAFFER_EFFECT) {
      continue;
    }

    const thisModifierValue = modifier[modifierKey] ?? 0;
    // This gets us the number we want to change by
    const changeInModifier = Math.abs(thisModifierValue) * newMultiplier;
    // And this sets it in the direction we want
    newMultiplier = thisModifierValue > 0 ? newMultiplier + changeInModifier : newMultiplier - changeInModifier;
  }

  return Math.max(newMultiplier, 0);
}

export function getCostToAcquireModifier(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  activeStaffer: IActiveOrPossibleStaffer | undefined,
): number {
  return getStafferModifier("costToAcquire", allPassedGameModifiers, activeStaffer);
}

export function getTimeToAcquireModifier(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  activeStaffer: IActiveOrPossibleStaffer | undefined,
): number {
  return getStafferModifier("timeToAcquire", allPassedGameModifiers, activeStaffer);
}

export function getEffectivenessModifier(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  activeStaffer: IActiveOrPossibleStaffer | undefined,
): number {
  return getStafferModifier("effectiveness", allPassedGameModifiers, activeStaffer);
}

function getDisabledStaffers(
  modifierKey: "disableHiring" | "disableTraining",
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
) {
  const disabledStaffers: IStafferEffect["staffersAffected"][number][] = [];

  for (const { modifier } of allPassedGameModifiers) {
    if (modifier.type === STAFFER_EFFECT) {
      continue;
    }

    if (modifier[modifierKey] !== true) {
      continue;
    }

    disabledStaffers.push(...modifier.staffersAffected);
  }

  return disabledStaffers;
}

export function isStafferHiringDisabled(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  staffer: IActiveOrPossibleStaffer,
) {
  const disabledStaffers = getDisabledStaffers("disableHiring", allPassedGameModifiers);
  return disabledStaffers.some((category) => isStafferInCategory(staffer, category));
}

export function isStafferTrainingDisabled(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  staffer: IActiveOrPossibleStaffer,
) {
  const disabledStaffers = getDisabledStaffers("disableTraining", allPassedGameModifiers);
  return disabledStaffers.some((category) => isStafferInCategory(staffer, category));
}

function getResolutionModifier(
  modifierKey:
    | "timePerResolution"
    | "timeBetweenResolutions"
    | "payoutPerResolution"
    | "payoutPerPlayer"
    | "earlyVotingBonus",
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
) {
  const relevantModifiers = allPassedGameModifiers
    .filter((modifier) => modifier.modifier.type === STAFFER_EFFECT)
    .sort((a, b) => (a.createdOn > b.createdOn ? 1 : -1));

  let newMultiplier = 1;
  for (const { modifier } of relevantModifiers) {
    if (modifier.type === "staffer-effect") {
      continue;
    }

    const thisModifierValue = modifier[modifierKey] ?? 0;
    // This gets us the number we want to change by
    const changeInModifier = Math.abs(thisModifierValue) * newMultiplier;
    // And this sets it in the direction we want
    newMultiplier = thisModifierValue > 0 ? newMultiplier + changeInModifier : newMultiplier - changeInModifier;
  }

  return Math.max(newMultiplier, 0);
}

export function getTimePerResolutionModifier(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
) {
  return getResolutionModifier("timePerResolution", allPassedGameModifiers);
}

export function getTimeBetweenResolutionsModifier(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
) {
  return getResolutionModifier("timeBetweenResolutions", allPassedGameModifiers);
}

export function getPayoutPerResolutionModifier(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
) {
  return getResolutionModifier("payoutPerResolution", allPassedGameModifiers);
}

export function getPayoutPerPlayerModifier(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  activePlayerStaffers: IActiveStaffer[],
) {
  const finalModifiers: Array<IPassedGameModifier | IActivePlayerModifier> = [...allPassedGameModifiers];
  if (activePlayerStaffers.find((s) => s.stafferDetails.type === "lobbyist")?.state === "active") {
    finalModifiers.push({ createdOn: 0 as IGameClock, modifier: LOBBYIST_MODIFIER });
  }

  return getResolutionModifier("payoutPerPlayer", finalModifiers);
}

export function getEarlyVotingBonusModifier(
  allPassedGameModifiers: Array<IPassedGameModifier | IActivePlayerModifier>,
  activePlayerStaffers: IActiveStaffer[],
) {
  const finalModifiers: Array<IPassedGameModifier | IActivePlayerModifier> = [...allPassedGameModifiers];
  if (activePlayerStaffers.find((s) => s.stafferDetails.type === "lobbyist")?.state === "active") {
    finalModifiers.push({ createdOn: 0 as IGameClock, modifier: LOBBYIST_MODIFIER });
  }

  return getResolutionModifier("earlyVotingBonus", finalModifiers);
}

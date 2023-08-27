/*
 * Copyright 2023 KM.
 */

import { ACCOUNTANT_MODIFIER, CHIEF_OF_STAFF_MODIFIER } from "../constants/game";
import { type IGameClock } from "../types/BrandedIDs";
import { DEFAULT_STAFFER, type IPossibleStaffer } from "../types/generatedStaffers";
import {
  type IAdjunctInstructor,
  type IGenerator,
  type IInitiate,
  type IPhoneBanker,
  type IRecruit,
  type IRecruiter,
  type IRepresentative,
  type ITrainer,
  type IVoter,
} from "../types/Staffer";
import {
  type IActivePlayerModifier,
  type IActiveStaffer,
  type IPassedGameModifier,
} from "../types/politicalCapitalTwo";
import { getCostToAcquireModifier, getEffectivenessModifier, getTimeToAcquireModifier } from "./gameModifierUtils";

export type IActiveOrPossibleStaffer = IActiveStaffer | IPossibleStaffer;

export function isActiveStaffer(staffer: IActiveOrPossibleStaffer): staffer is IActiveStaffer {
  return (staffer as IActiveStaffer).stafferDetails !== undefined;
}

export function getStafferDetails(staffer: IActiveOrPossibleStaffer): IPossibleStaffer {
  if (isActiveStaffer(staffer)) {
    return staffer.stafferDetails;
  }

  return staffer;
}

export function getStafferAcquisitionTime(
  staffer: IActiveOrPossibleStaffer,
  passedGameModifiers: IPassedGameModifier[],
  activePlayerStaffers: IActiveStaffer[],
) {
  const stafferDetails = getStafferDetails(staffer);

  const finalModifiers: Array<IPassedGameModifier | IActivePlayerModifier> = [...passedGameModifiers];
  if (activePlayerStaffers.find((s) => s.stafferDetails.type === "chiefOfStaff")?.state === "active") {
    finalModifiers.push({ createdOn: 0 as IGameClock, modifier: CHIEF_OF_STAFF_MODIFIER });
  }

  const timeModifier = getTimeToAcquireModifier(finalModifiers, staffer);

  return Math.round(stafferDetails.timeToAcquire * timeModifier);
}

export function getStafferAcquisitionCost(
  staffer: IActiveOrPossibleStaffer,
  passedGameModifiers: IPassedGameModifier[],
  activePlayerStaffers: IActiveStaffer[],
) {
  const stafferDetails = getStafferDetails(staffer);

  const finalModifiers: Array<IPassedGameModifier | IActivePlayerModifier> = [...passedGameModifiers];
  if (activePlayerStaffers.find((s) => s.stafferDetails.type === "accountant")?.state === "active") {
    finalModifiers.push({ createdOn: 0 as IGameClock, modifier: ACCOUNTANT_MODIFIER });
  }

  const costModifier = getCostToAcquireModifier(finalModifiers, staffer);

  return Math.round(stafferDetails.costToAcquire * costModifier);
}

/**
 * Recruiter
 */

export function isRecruit(staffer: IActiveOrPossibleStaffer): staffer is IRecruiter {
  return (getStafferDetails(staffer) as IRecruit).recruitCapacity !== undefined;
}

export function getTotalAllowedRecruits(
  staffer: IActiveOrPossibleStaffer,
  passedGameModifiers: IPassedGameModifier[],
): number {
  const stafferDetails = getStafferDetails(staffer);
  if ((isActiveStaffer(staffer) && staffer.state === "disabled") || !isRecruit(stafferDetails)) {
    return 0;
  }

  return Math.floor(stafferDetails.recruitCapacity * getEffectivenessModifier(passedGameModifiers, staffer));
}

/**
 * Trainer
 */

export function isTrainer(staffer: IActiveOrPossibleStaffer): staffer is IAdjunctInstructor {
  return (getStafferDetails(staffer) as ITrainer).trainingCapacity !== undefined;
}

export function getTotalAllowedTrainees(
  staffer: IActiveOrPossibleStaffer,
  passedGameModifiers: IPassedGameModifier[],
): number {
  const stafferDetails = getStafferDetails(staffer);
  if ((isActiveStaffer(staffer) && staffer.state === "disabled") || !isTrainer(stafferDetails)) {
    return 0;
  }

  return Math.floor(stafferDetails.trainingCapacity * getEffectivenessModifier(passedGameModifiers, staffer));
}

/**
 * Voter
 */

export function isVoter(staffer: IActiveOrPossibleStaffer): staffer is IRepresentative {
  return (getStafferDetails(staffer) as IVoter).votes !== undefined;
}

export function getTotalAllowedVotes(
  staffer: IActiveOrPossibleStaffer,
  passedGameModifiers: IPassedGameModifier[],
): number {
  const stafferDetails = getStafferDetails(staffer);
  if ((isActiveStaffer(staffer) && staffer.state === "disabled") || !isVoter(stafferDetails)) {
    return 0;
  }

  return Math.floor(stafferDetails.votes * getEffectivenessModifier(passedGameModifiers, staffer));
}

/**
 * Generator
 */

export function isGenerator(staffer: IActiveOrPossibleStaffer): staffer is IPhoneBanker {
  return (getStafferDetails(staffer) as IGenerator).payout !== undefined;
}

export function getTotalPayout(staffer: IActiveOrPossibleStaffer, passedGameModifiers: IPassedGameModifier[]): number {
  const stafferDetails = getStafferDetails(staffer);
  if ((isActiveStaffer(staffer) && staffer.state === "disabled") || !isGenerator(stafferDetails)) {
    return 0;
  }

  return stafferDetails.payout * getEffectivenessModifier(passedGameModifiers, stafferDetails);
}

/**
 * Shadow government
 */

export function isShadowGovernment(staffer: IActiveOrPossibleStaffer): staffer is IInitiate {
  return (getStafferDetails(staffer) as IInitiate).shadowGovernment === true;
}

/**
 * Filtered constants
 */

export const allRecruits = (() => {
  const allStaffers = Object.values(DEFAULT_STAFFER);
  return allStaffers.filter((s) => isRecruit(s)).sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

export const allTrainers = (() => {
  const allStaffers = Object.values(DEFAULT_STAFFER);
  return allStaffers.filter((s) => isTrainer(s)).sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

export const allGenerators = (() => {
  const allStaffers = Object.values(DEFAULT_STAFFER);
  return allStaffers.filter((s) => isGenerator(s)).sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

export const allVoters = (() => {
  const allStaffers = Object.values(DEFAULT_STAFFER);
  return allStaffers.filter((s) => isVoter(s)).sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

export const allShadowGovernment = (() => {
  const allStaffers = Object.values(DEFAULT_STAFFER);
  return allStaffers.filter((s) => isShadowGovernment(s)).sort((a, b) => a.displayName.localeCompare(b.displayName));
})();

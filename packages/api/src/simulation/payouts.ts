/*
 * Copyright 2023 KM.
 */

import { TOTAL_DAYS_IN_GAME } from "../constants/game";
import { type IGameClock } from "../types/BrandedIDs";
import { type IActiveStaffer, type IPassedGameModifier } from "../types/politicalCapitalTwo";
import { getStafferDetails, getTotalPayout, type IActiveOrPossibleStaffer, isGenerator } from "../utils/staffer";
import { getTotalCostForStaffer, getTotalTimeCost } from "./costs";

export function getPotentialPayoutForStaffer(
  staffer: IActiveOrPossibleStaffer,
  passedGameModifiers: IPassedGameModifier[],
  currentGameClock: IGameClock,
  activePlayerStaffers: IActiveStaffer[],
) {
  const stafferDetails = getStafferDetails(staffer);
  if (!isGenerator(stafferDetails)) {
    return 0;
  }

  const costToAcquire = getTotalCostForStaffer(staffer, passedGameModifiers, activePlayerStaffers);
  const timeToAcquire = getTotalTimeCost(staffer, passedGameModifiers, activePlayerStaffers);
  const totalPayoutPerDay = getTotalPayout(
    { ...stafferDetails, state: "active" } as IActiveOrPossibleStaffer,
    passedGameModifiers,
  );

  const totalPayoutDays = TOTAL_DAYS_IN_GAME - currentGameClock - timeToAcquire;

  return totalPayoutPerDay * totalPayoutDays - costToAcquire;
}

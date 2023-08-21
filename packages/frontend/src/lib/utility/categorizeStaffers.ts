/*
 * Copyright 2023 KM.
 */

import {
  DEFAULT_STAFFER,
  getStafferCategory,
  getStafferDetails,
  type IActiveOrPossibleStaffer,
  isActiveStaffer,
  type IStafferCategory,
  StafferLadderIndex,
} from "@pc2/api";
import { type IResolvedGameModifiersForEachStaffer } from "../selectors/gameModifiers";

export function getStaffersOfCategory<StafferType extends IActiveOrPossibleStaffer>(
  activeStaffers: StafferType[],
  category: IStafferCategory | undefined,
  gameModifiers: IResolvedGameModifiersForEachStaffer,
): StafferType[] {
  return [...activeStaffers]
    .filter((activeStaffer) => {
      return getStafferCategory(getStafferDetails(activeStaffer)) === category;
    })
    .sort((a, b) => {
      if (isActiveStaffer(a) && isActiveStaffer(b) && a.state !== b.state) {
        return a.state.localeCompare(b.state);
      }

      const stafferDetailsA = getStafferDetails(a);
      const stafferDetailsB = getStafferDetails(b);

      const defaultCompare = stafferDetailsA.type.localeCompare(stafferDetailsB.type);

      const aEffectiveness = gameModifiers[stafferDetailsA.type].effectiveness;
      const bEffectiveness = gameModifiers[stafferDetailsB.type].effectiveness;

      return aEffectiveness === bEffectiveness ? defaultCompare : aEffectiveness > bEffectiveness ? -1 : 1;
    });
}

export function getTrainsIntoDisplayName(staffer: IActiveOrPossibleStaffer): string[] {
  const stafferDetails = getStafferDetails(staffer);

  return StafferLadderIndex[stafferDetails.type].map(
    (type: keyof typeof DEFAULT_STAFFER) => DEFAULT_STAFFER[type].displayName,
  );
}

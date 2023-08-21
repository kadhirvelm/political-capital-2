/*
 * Copyright 2023 KM.
 */

import { type IActiveResolutionRid, type IGameClock, type IGameStateRid } from "../../types/BrandedIDs";
import { DEFAULT_STAFFER } from "../../types/generatedStaffers";
import { type IPassedGameModifier } from "../../types/politicalCapitalTwo";
import { getEffectivenessModifier } from "../gameModifierUtils";

const STAFFER_EFFECT = "staffer-effect";

describe("Game modifier utils works as expected", () => {
  it("effectiveness modifiers works as expected", () => {
    const someGameState = "some-game-state-rid" as IGameStateRid;
    const someResolution = "some-resolution" as IActiveResolutionRid;

    const modifiers: IPassedGameModifier[] = [
      {
        createdOn: 0 as IGameClock,
        fromActiveResolutionRid: someResolution,
        gameStateRid: someGameState,
        modifier: {
          effectiveness: 1,
          staffersAffected: ["everyone"],
          type: STAFFER_EFFECT,
        },
      },
      {
        createdOn: 1 as IGameClock,
        fromActiveResolutionRid: someResolution,
        gameStateRid: someGameState,
        modifier: {
          effectiveness: -0.5,
          staffersAffected: ["everyone"],
          type: STAFFER_EFFECT,
        },
      },
    ];

    expect(getEffectivenessModifier(modifiers, DEFAULT_STAFFER.representative)).toEqual(1);

    const modifiersTwo: IPassedGameModifier[] = [
      {
        createdOn: 0 as IGameClock,
        fromActiveResolutionRid: someResolution,
        gameStateRid: someGameState,
        modifier: {
          effectiveness: 0.5,
          staffersAffected: ["everyone"],
          type: STAFFER_EFFECT,
        },
      },
      {
        createdOn: 1 as IGameClock,
        fromActiveResolutionRid: someResolution,
        gameStateRid: someGameState,
        modifier: {
          effectiveness: -0.5,
          staffersAffected: ["everyone"],
          type: STAFFER_EFFECT,
        },
      },
    ];

    expect(getEffectivenessModifier(modifiersTwo, DEFAULT_STAFFER.representative)).toEqual(0.75);
  });
});

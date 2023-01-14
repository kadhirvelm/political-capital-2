/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolutionRid, IGameClock, IGameStateRid } from "../../types/BrandedIDs";
import { DEFAULT_STAFFER } from "../../types/generatedStaffers";
import { IPassedGameModifier } from "../../types/politicalCapitalTwo";
import { getEffectivenessModifier } from "../gameModifierUtils";

describe("Game modifier utils works as expected", () => {
    it("effectiveness modifiers works as expected", () => {
        const someGameState = "some-game-state-rid" as IGameStateRid;
        const someResolution = "some-resolution" as IActiveResolutionRid;

        const modifiers: IPassedGameModifier[] = [
            {
                gameStateRid: someGameState,
                fromActiveResolutionRid: someResolution,
                modifier: {
                    type: "staffer-effect",
                    staffersAffected: ["everyone"],
                    effectiveness: 1,
                },
                createdOn: 0 as IGameClock,
            },
            {
                gameStateRid: someGameState,
                fromActiveResolutionRid: someResolution,
                modifier: {
                    type: "staffer-effect",
                    staffersAffected: ["everyone"],
                    effectiveness: -0.5,
                },
                createdOn: 1 as IGameClock,
            },
        ];

        expect(getEffectivenessModifier(modifiers, DEFAULT_STAFFER.representative)).toEqual(1);

        const modifiersTwo: IPassedGameModifier[] = [
            {
                gameStateRid: someGameState,
                fromActiveResolutionRid: someResolution,
                modifier: {
                    type: "staffer-effect",
                    staffersAffected: ["everyone"],
                    effectiveness: 0.5,
                },
                createdOn: 0 as IGameClock,
            },
            {
                gameStateRid: someGameState,
                fromActiveResolutionRid: someResolution,
                modifier: {
                    type: "staffer-effect",
                    staffersAffected: ["everyone"],
                    effectiveness: -0.5,
                },
                createdOn: 1 as IGameClock,
            },
        ];

        expect(getEffectivenessModifier(modifiersTwo, DEFAULT_STAFFER.representative)).toEqual(0.75);
    });
});

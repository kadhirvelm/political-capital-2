/**
 * Copyright (c) 2022 - KM
 */

import { IActiveResolutionRid, IGameClock, IGameStateRid } from "../../types/BrandedIDs";
import { IPassedGameModifier } from "../../types/politicalCapitalTwo";
import { getEffectivenessModifier } from "../gameModifierUtils";
import { IActiveOrPossibleStaffer } from "../staffer";

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

        expect(getEffectivenessModifier(modifiers, { type: "coach" } as IActiveOrPossibleStaffer)).toEqual(1);

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

        expect(getEffectivenessModifier(modifiersTwo, { type: "coach" } as IActiveOrPossibleStaffer)).toEqual(0.75);
    });
});

/**
 * Copyright (c) 2022 - KM
 */

import { IVisit } from "./IVisit";

interface IBasicResolution {
    resolutionRid: string;
    politicalCapitalPayout: number;
    type: string;
}

interface IDoublePoliticalCapitalFromResolutions extends IBasicResolution {
    title: "Double all the things.";
    effect: "Doubles the political capital earned from resolutions.";
    type: "double-political-capital-from-resolutions";
}

interface IAllResolutions {
    doublePoliticalCapitalFromResolutions: IDoublePoliticalCapitalFromResolutions;
    unknown: never;
}

export type IPossibleResolution = IAllResolutions[keyof IAllResolutions];

export interface IPastResolution extends IPossibleResolution {
    vote: {
        inFavor: string[];
        against: string[];
        abstain: string[];
    };
    didPass: boolean;
}

export namespace IResolution {
    export const isDoublePoliticalCapitalFromResolutions = (
        resolution: IPossibleResolution,
    ): resolution is IDoublePoliticalCapitalFromResolutions => {
        return resolution.type === "double-political-capital-from-resolutions";
    };

    export const visit = <ReturnValue>(value: IPossibleResolution, visitor: IVisit<IAllResolutions, ReturnValue>) => {
        if (isDoublePoliticalCapitalFromResolutions(value)) {
            return visitor.doublePoliticalCapitalFromResolutions(value);
        }

        return visitor.unknown(value);
    };
}

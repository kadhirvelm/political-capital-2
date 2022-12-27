/**
 * Copyright (c) 2022 - KM
 */

import { IVisit } from "./IVisit";

export interface IBasicResolution {
    politicalCapitalPayout: number;
    type: string;
}

export interface IDoublePoliticalCapitalFromResolutions extends IBasicResolution {
    politicalCapitalPayout: 10;
    title: "Double all the things.";
    effect: "Doubles the political capital earned from resolutions.";
    type: "double-political-capital-from-resolutions";
}

interface IAllResolutions {
    doublePoliticalCapitalFromResolutions: IDoublePoliticalCapitalFromResolutions;
    unknown: never;
}

export const DEFAULT_RESOLUTIONS: IAllResolutions = {
    doublePoliticalCapitalFromResolutions: {
        politicalCapitalPayout: 10,
        title: "Double all the things.",
        effect: "Doubles the political capital earned from resolutions.",
        type: "double-political-capital-from-resolutions",
    },
    unknown: {} as never,
};

export type IPossibleResolution = IAllResolutions[keyof IAllResolutions];

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

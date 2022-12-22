/**
 * Copyright (c) 2022 - KM
 */

export interface IMinimalVisitor {
    unknown: never;
}

export type IVisit<PossibleTypes extends IMinimalVisitor, ReturnValue> = {
    [key in keyof PossibleTypes]: (value: PossibleTypes[key]) => ReturnValue;
};

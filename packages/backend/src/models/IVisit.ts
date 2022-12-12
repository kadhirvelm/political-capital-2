/**
 * Copyright (c) 2022 - KM
 */

export type IVisit<PossibleTypes, ReturnValue> = {
    [key in keyof PossibleTypes]: (value: PossibleTypes[key]) => ReturnValue;
};

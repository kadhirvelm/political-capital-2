/*
 * Copyright 2023 KM.
 */

export interface IMinimalVisitor {
  unknown: never;
}

export type VisitorPattern<InputVisitor, GenericType> = {
  typeChecks: {
    [Key in keyof InputVisitor]: (possibleType: InputVisitor[Key] | GenericType) => possibleType is InputVisitor[Key];
  };
  visit: <ReturnValue>(value: GenericType, visitor: Visit<InputVisitor, ReturnValue>) => ReturnValue;
};

export type Visit<PossibleTypes, ReturnValue> = {
  [key in keyof (PossibleTypes & IMinimalVisitor)]: (value: (PossibleTypes & IMinimalVisitor)[key]) => ReturnValue;
};

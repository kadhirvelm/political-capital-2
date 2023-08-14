/*
 * Copyright 2023 KM.
 */

export interface IMinimalVisitor {
  unknown: never;
}

export type GenericType<InputVisitor> = InputVisitor[keyof InputVisitor];

export type VisitorPattern<InputVisitor> = {
  typeChecks: {
    [Key in keyof InputVisitor]: (
      possibleType: InputVisitor[Key] | GenericType<InputVisitor>,
    ) => possibleType is InputVisitor[Key];
  };
  visit: <ReturnValue>(value: GenericType<InputVisitor>, visitor: Visit<InputVisitor, ReturnValue>) => ReturnValue;
};

export type Visit<PossibleTypes, ReturnValue> = {
  [key in keyof (PossibleTypes & IMinimalVisitor)]: (value: (PossibleTypes & IMinimalVisitor)[key]) => ReturnValue;
};

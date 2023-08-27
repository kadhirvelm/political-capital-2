/*
 * Copyright 2023 KM.
 */

interface IValidClassnames {
  /** Shows up as GlobalScreen.module_globalScreen_HASH */
  globalScreen: string;
  /** Shows up as GlobalScreen.module_leftSide_HASH */
  leftSide: string;
  /** Shows up as GlobalScreen.module_rightSide_HASH */
  rightSide: string;
}

declare const ValidClassnames: IValidClassnames;
export = ValidClassnames;

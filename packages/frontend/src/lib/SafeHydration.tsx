/*
 * Copyright 2023 KM.
 */

import { type PropsWithChildren } from "react";

export const SafeHydration = ({ children }: PropsWithChildren) => {
  if (typeof window === "undefined") {
    return children;
  }

  return children;
};

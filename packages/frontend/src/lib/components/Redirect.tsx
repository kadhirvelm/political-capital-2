/*
 * Copyright 2023 KM.
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectToPlayer() {
  const { push } = useRouter();

  useEffect(() => {
    push("/player");
  }, []);

  return <div />;
}

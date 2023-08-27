/*
 * Copyright 2023 KM.
 */

"use client";

import { SafeHydration } from "../../lib/SafeHydration";
import { GlobalScreen } from "../../lib/components/GlobalScreen";
import PoliticalCapitalProviders from "../../lib/providers";

export default function GlobalScreenPage() {
  return (
    <SafeHydration>
      <PoliticalCapitalProviders>
        <GlobalScreen />
      </PoliticalCapitalProviders>
    </SafeHydration>
  );
}

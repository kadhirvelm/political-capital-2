/*
 * Copyright 2023 KM.
 */

"use client";

import { SafeHydration } from "../../lib/SafeHydration";
import { PoliticalCapitalTwo } from "../../lib/components/PoliticalCapitalTwo";
import PoliticalCapitalProviders from "../../lib/providers";

export default function Home() {
  return (
    <SafeHydration>
      <PoliticalCapitalProviders>
        <PoliticalCapitalTwo />
      </PoliticalCapitalProviders>
    </SafeHydration>
  );
}

/**
 * Copyright (c) 2023 - KM
 */

import { ALL_RESOLUTIONS } from "../IResolution";

describe("Resolutions", () => {
    it("distribution of resolutions", () => {
        const totalEarly = ALL_RESOLUTIONS.filter((r) => r.stage === "early").length;
        const totalMid = ALL_RESOLUTIONS.filter((r) => r.stage === "middle").length;
        const totalLate = ALL_RESOLUTIONS.filter((r) => r.stage === "late").length;

        console.log({ totalEarly, totalMid, totalLate });

        expect(totalEarly + totalMid + totalLate).toEqual(ALL_RESOLUTIONS.length);
    });
});

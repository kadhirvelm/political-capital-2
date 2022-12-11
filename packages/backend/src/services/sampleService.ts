/**
 * Copyright (c) 2022 - KM
 */

import { ISampleService } from "@pc2/api";

export function sampleEndpoint(
    payload: ISampleService["sampleEndpoint"]["payload"],
): Promise<ISampleService["sampleEndpoint"]["response"]> {
    return new Promise((resolve) => {
        resolve({ newPayload: `You sent: ${payload}` });
    });
}

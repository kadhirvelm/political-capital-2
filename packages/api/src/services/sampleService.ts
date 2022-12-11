/**
 * Copyright (c) 2022 - KM
 */

import { implementEndpoints, IService } from "../common/generics";

export interface ISampleService extends IService {
    sampleEndpoint: {
        payload: { samplePayload: string };
        response: { newPayload: string };
    };
}

const { backend, frontend } = implementEndpoints<ISampleService>({
    sampleEndpoint: {
        method: "post",
        isPublic: true,
        slug: "/sample-endpoint",
    },
});

export const SampleServiceBackend = backend;
export const SampleServiceFrontend = frontend;

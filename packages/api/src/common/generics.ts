/**
 * Copyright (c) 2022 - KM
 */

import Express from "express";
import { getBackendUrlFromFrontend } from "../constants";

type IAccountId = string & { _brand: "user-id" };

type IMethods = "get" | "post" | "put" | "delete";

export interface IEndpoint<Payload, Response> {
    payload: Payload;
    response: Response;
}

export type IService = Record<string, IEndpoint<any, any>>;

type IImplementEndpoint<Service extends IService> = {
    [Key in keyof Service]: {
        method: IMethods;
        slug: string;
        isPublic?: boolean;
    };
};

export type IBackendEndpoint<Service extends IService> = {
    [Key in keyof Service]: (
        payload: Service[Key]["payload"],
        response: Express.Response,
        accountId: IAccountId | null,
    ) => Promise<Service[Key]["response"] | undefined>;
};

export type IFrontendEndpoint<Service extends IService> = {
    [Key in keyof Service]: (
        payload: Service[Key]["payload"],
        cookie?: string,
    ) => Promise<Service[Key]["response"] | { error: string }>;
};

const STORE_TOKEN_KEY = "accountIdFromToken";

function implementBackend<Service extends IService>(endpoints: IImplementEndpoint<Service>) {
    return (
        app: Express.Express,
        decodeWebToken: (token: string | undefined) => IAccountId | null,
        backendImplementedEndpoints: IBackendEndpoint<Service>,
    ) => {
        const verifyToken =
            (isPublic: boolean) =>
            (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
                if (isPublic) {
                    next();
                    return;
                }

                const token = decodeWebToken(request.headers.authorization);
                if (token == null) {
                    response.status(403).send({ error: "Invalid authorization token." });
                } else {
                    request.body = request.body ?? {};
                    request.body[STORE_TOKEN_KEY] = token;

                    next();
                }
            };

        Object.entries(endpoints).forEach((endpoint) => {
            const [key, { method, slug, isPublic }] = endpoint;
            app[method](`/api${slug}`, verifyToken(isPublic ?? false), async (request, response) => {
                try {
                    const payload = method === "get" ? Object.values(request.params)[0] : request.body;
                    const accountIdFromToken = request.body[STORE_TOKEN_KEY] as IAccountId | null;

                    const responseData = await backendImplementedEndpoints[key](payload, response, accountIdFromToken);
                    if (responseData === undefined) {
                        return;
                    }

                    response.status(200).send(JSON.stringify(responseData));
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                    response.status(500).send({ error: JSON.stringify(e) });
                }
            });
        });
    };
}

function maybeRemoveVariableFromSlug(slug: string) {
    const allParts = slug.split("/");
    if (!allParts.slice(-1)[0].startsWith(":")) {
        return slug;
    }

    return allParts.slice(0, -1).join("/");
}

declare global {
    interface Window {
        onTokenInvalidate: () => void;
    }
}

function implementFrontend<Service extends IService>(
    endpoints: IImplementEndpoint<Service>,
): IFrontendEndpoint<Service> {
    const endpointsWithRestRequest: IFrontendEndpoint<Service> = {} as any;

    Object.keys(endpoints).forEach((endpointKey: keyof Service) => {
        const { method, slug } = endpoints[endpointKey];
        endpointsWithRestRequest[endpointKey] = async (payload: any, cookie?: string) => {
            let rawResponse: globalThis.Response;

            const headers =
                cookie == null
                    ? { "Content-Type": "application/json", Authorization: "N/A" }
                    : { "Content-Type": "application/json", Authorization: cookie };

            const hostname = getBackendUrlFromFrontend();

            if (method === "get") {
                const stringPayload: string = typeof payload === "string" ? `/${payload}` : "";

                rawResponse = await fetch(`${hostname}/api${maybeRemoveVariableFromSlug(slug)}${stringPayload}`, {
                    headers,
                    method,
                });
            } else {
                rawResponse = await fetch(`${hostname}/api${slug}`, {
                    headers,
                    body: JSON.stringify(payload),
                    method: method.toUpperCase(),
                });
            }

            // This is a magic function thrown on the window on the frontend that lets us invalidate the token whenever any request comes back as a 403.
            if (rawResponse.status === 403) {
                window.onTokenInvalidate();
                return undefined;
            }

            return (await rawResponse.json()) as Response;
        };
    });

    return endpointsWithRestRequest;
}

export function implementEndpoints<Service extends IService>(
    endpoints: IImplementEndpoint<Service>,
): {
    backend: (
        app: Express.Express,
        decodeWebToken: (token: string | undefined) => IAccountId | null,
        backendImplementedEndpoints: IBackendEndpoint<Service>,
    ) => void;
    frontend: IFrontendEndpoint<Service>;
} {
    return {
        backend: implementBackend<Service>(endpoints),
        frontend: implementFrontend<Service>(endpoints),
    };
}

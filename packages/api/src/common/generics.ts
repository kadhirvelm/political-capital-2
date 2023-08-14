/*
 * Copyright 2023 KM.
 */


import type Express from "express";

type IMethods = "get" | "post" | "put" | "delete";

export interface IEndpoint<Payload, Response> {
  payload: Payload;
  response: Response;
}

export type IService = Record<string, IEndpoint<any, any>>;

export type IImplementEndpoint<Service extends IService> = {
  [Key in keyof Service]: {
    method: IMethods;
    slug: string;
  };
};

export type IBackendEndpoint<Service extends IService> = {
  [Key in keyof Service]: (
    payload: Service[Key]["payload"],
    response: Express.Response,
  ) => Promise<Service[Key]["response"] | undefined>;
};

export type IFrontendEndpoint<Service extends IService> = {
  [Key in keyof Service]: (
    payload: Service[Key]["payload"],
    cookie?: string,
  ) => Promise<Service[Key]["response"] | { error: string }>;
};

function implementBackend<Service extends IService>(endpoints: IImplementEndpoint<Service>) {
  return (app: Express.Express, backendImplementedEndpoints: IBackendEndpoint<Service>) => {
    for (const endpoint of Object.entries(endpoints)) {
            const [key, { method, slug }] = endpoint;
            app[method](`/api${slug}`, async (request, response) => {
                try {
                    const payload = method === "get" ? Object.values(request.params)[0] : request.body;

                    const responseData = await backendImplementedEndpoints[key](payload, response);
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
        }
  };
}

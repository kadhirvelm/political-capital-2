/*
 * Copyright 2023 KM.
 */

import { type Express } from "express";
import { type IBackendEndpoint, type IImplementEndpoint, type IService } from "@pc2/api";

export function implementBackend<Service extends IService>(endpoints: IImplementEndpoint<Service>) {
  return (app: Express, backendImplementedEndpoints: IBackendEndpoint<Service>) => {
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
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          response.status(500).send({ error: JSON.stringify(error) });
        }
      });
    }
  };
}

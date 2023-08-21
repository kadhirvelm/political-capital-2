/*
 * Copyright 2023 KM.
 */

import { type IFrontendEndpoint, type IImplementEndpoint, type IService } from "@pc2/api";
import { getBackendUrlFromFrontend } from "./constants";

function maybeRemoveVariableFromSlug(slug: string) {
  const allParts = slug.split("/");
  if (!allParts.at(-1)?.startsWith(":")) {
    return slug;
  }

  return allParts.slice(0, -1).join("/");
}

declare global {
  interface Window {
    /* This is a magic function thrown on the window on the frontend that lets us invalidate the token whenever any request comes back as a 403. */
    onInvalidGame: () => void;
  }
}

export function implementFrontend<Service extends IService>(
  endpoints: IImplementEndpoint<Service>,
): IFrontendEndpoint<Service> {
  const endpointsWithRestRequest: IFrontendEndpoint<Service> = {} as IFrontendEndpoint<Service>;

  for (const endpointKey of Object.keys(endpoints) as Array<keyof Service>) {
    const { method, slug } = endpoints[endpointKey];
    endpointsWithRestRequest[endpointKey] = async (payload: unknown, cookie?: string) => {
      let rawResponse: globalThis.Response;

      const headers =
        cookie == undefined
          ? // eslint-disable-next-line @typescript-eslint/naming-convention
            { Authorization: "N/A", "Content-Type": "application/json" }
          : // eslint-disable-next-line @typescript-eslint/naming-convention
            { Authorization: cookie, "Content-Type": "application/json" };

      const hostname = getBackendUrlFromFrontend();

      if (method === "get") {
        const stringPayload: string = typeof payload === "string" ? `/${payload}` : "";

        rawResponse = await fetch(`${hostname}/api${maybeRemoveVariableFromSlug(slug)}${stringPayload}`, {
          headers,
          method,
        });
      } else {
        rawResponse = await fetch(`${hostname}/api${slug}`, {
          body: JSON.stringify(payload),
          headers,
          method: method.toUpperCase(),
        });
      }

      if (rawResponse.status === 403) {
        window.onInvalidGame();
        return;
      }

      return (await rawResponse.json()) as Response;
    };
  }

  return endpointsWithRestRequest;
}

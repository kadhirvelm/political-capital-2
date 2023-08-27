/*
 * Copyright 2023 KM.
 */

type IMethods = "get" | "post" | "put" | "delete";

export interface IEndpoint<Payload, Response> {
  payload: Payload;
  response: Response;
}

export type IService = Record<string, IEndpoint<unknown, unknown>>;

export type IImplementEndpoint<Service extends IService> = {
  [Key in keyof Service]: {
    method: IMethods;
    slug: string;
  };
};

export type IBackendEndpoint<Service extends IService> = {
  [Key in keyof Service]: (
    payload: Service[Key]["payload"],
    response: unknown,
  ) => Promise<Service[Key]["response"] | undefined>;
};

export type IFrontendEndpoint<Service extends IService> = {
  [Key in keyof Service]: (
    payload: Service[Key]["payload"],
    cookie?: string,
  ) => Promise<Service[Key]["response"] | { error: string }>;
};

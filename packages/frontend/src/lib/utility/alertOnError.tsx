/**
 * Copyright (c) 2022 - KM
 */

import { CreateToastFnReturn } from "@chakra-ui/react";

function isError<T>(maybeError: T | { error: string }): maybeError is { error: string } {
    return (maybeError as { error: string }).error !== undefined;
}

export function checkIsError<T>(maybeError: T | { error: string }, toast: CreateToastFnReturn): T | undefined {
    if (isError(maybeError)) {
        // eslint-disable-next-line no-console
        console.error(maybeError);
        toast({
            title: "Error",
            description: maybeError.error,
            status: "error",
        });
        return undefined;
    }

    return maybeError;
}

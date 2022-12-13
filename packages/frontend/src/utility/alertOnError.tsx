/**
 * Copyright (c) 2022 - KM
 */

function isError<T>(maybeError: T | { error: string }): maybeError is { error: string } {
    return (maybeError as { error: string }).error !== undefined;
}

export function checkIsError<T>(maybeError: T | { error: string }): T | undefined {
    if (isError(maybeError)) {
        console.error(maybeError);
        return undefined;
    }

    return maybeError;
}

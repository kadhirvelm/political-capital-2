/**
 * Copyright (c) 2022 - KM
 */

import { notification } from "antd";

function isError<T>(maybeError: T | { error: string }): maybeError is { error: string } {
    return (maybeError as { error: string }).error !== undefined;
}

export function checkIsError<T>(maybeError: T | { error: string }): T | undefined {
    if (isError(maybeError)) {
        notification.error({
            message: "Something went wrong.",
            description: maybeError.error,
        });

        return undefined;
    }

    return maybeError;
}

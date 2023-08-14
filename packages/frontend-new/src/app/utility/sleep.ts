/**
 * Copyright (c) 2022 - KM
 */

export function sleep(timeInSeconds: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({});
        }, timeInSeconds * 1000);
    });
}

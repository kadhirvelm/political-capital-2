/**
 * Copyright (c) 2022 - KM
 */

export function roundToHundred(num: number) {
    return Math.round(num * 100) / 100;
}

export function roundToThousand(num: number) {
    return Math.round(num * 1000) / 1000;
}

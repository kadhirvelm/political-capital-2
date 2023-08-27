/*
 * Copyright 2023 KM.
 */

export function roundToHundred(number_: number) {
  return Math.round(number_ * 100) / 100;
}

export function roundToThousand(number_: number) {
  return Math.round(number_ * 1000) / 1000;
}

/*
 * Copyright 2023 KM.
 */

export function sleep(timeInSeconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, timeInSeconds * 1000);
  });
}

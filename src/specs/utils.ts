export const emptyCb = (): void => {};

export const sleep = (time: number) => new Promise((r) => setTimeout(r, time));

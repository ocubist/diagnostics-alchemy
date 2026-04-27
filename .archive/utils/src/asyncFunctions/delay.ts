/**
 * Delay function to wait for a specified amount of time.
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the specified time.
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Removes `amount` stack frames from the top of an error's stack trace
 * (preserving the first "Error: ..." headline).
 */
export const popTraceStack = (err: Error, amount: number): void => {
  if (!err.stack) return;

  const [headline, ...frames] = err.stack.split("\n");

  err.stack =
    frames.length <= amount
      ? headline
      : [headline, ...frames.slice(amount)].join("\n");
};

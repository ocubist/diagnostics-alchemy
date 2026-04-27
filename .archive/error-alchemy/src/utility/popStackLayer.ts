/**
 * Modifies the stack trace of an error by removing a specified number of stack frames.
 *
 * @param {Error} err - The error whose stack trace should be modified.
 * @param {number} amount - The number of stack frames to remove.
 */
export const popTranceStack = (err: Error, amount: number) => {
  if (!err.stack) return;

  const [firstLine, ...rest] = err.stack.split("\n");

  if (rest.length <= amount) {
    err.stack = firstLine;
  } else {
    err.stack = [firstLine, ...rest.slice(amount)].join("\n");
  }
};

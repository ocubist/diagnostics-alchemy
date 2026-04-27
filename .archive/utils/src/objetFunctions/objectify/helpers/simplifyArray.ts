// simplifyArray.ts: Simplifies arrays and their elements

import { getTypeHandler } from "./getTypeHandler";

export const simplifyArray = (
  value: unknown,
  depth: number,
  visited: WeakSet<object>
): unknown[] => {
  const arr = value as unknown[]; // Cast to array
  return arr.map((item) => {
    const handler = getTypeHandler(item);
    return handler ? handler(item, depth - 1, visited) : null; // Null for unsupported types
  });
};

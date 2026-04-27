// simplifyObject.ts: Simplifies plain objects

import { getTypeHandler } from "./getTypeHandler";
import { sortKeys } from "./sortKeys";

export const simplifyObject = (
  value: unknown,
  depth: number,
  visited: WeakSet<object>
): Record<string, unknown> => {
  const obj = value as Record<string, unknown>; // Cast to object
  if (depth <= 0) {
    return { summary: "[Object]" };
  }

  const result: Record<string, unknown> = {};

  if (visited.has(obj)) {
    return { summary: "[Circular Reference]" };
  }
  visited.add(obj);

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const handler = getTypeHandler(value);

    if (handler) {
      result[key] = handler(value, depth - 1, visited);
    }
  });

  visited.delete(obj);
  return sortKeys(result); // Ensure deterministic key order
};

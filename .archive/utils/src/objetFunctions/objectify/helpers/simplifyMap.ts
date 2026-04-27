// simplifyMap.ts: Simplifies Map objects by converting them to plain objects

import { getTypeHandler } from "./getTypeHandler";

export const simplifyMap = (
  value: unknown,
  depth: number,
  visited: WeakSet<object>
): Record<string, unknown> => {
  const map = value as Map<unknown, unknown>; // Cast to Map
  const result: Record<string, unknown> = {};

  map.forEach((mapValue, key) => {
    if (typeof key !== "string") {
      // Only handle string keys for simplicity
      return;
    }

    const handler = getTypeHandler(mapValue);
    if (handler) {
      result[key] = handler(mapValue, depth - 1, visited);
    }
  });

  return result;
};

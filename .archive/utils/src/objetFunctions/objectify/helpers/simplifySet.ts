// simplifySet.ts: Simplifies Set objects by converting them to arrays

import { simplifyArray } from "./simplifyArray";

export const simplifySet = (
  value: unknown,
  depth: number,
  visited: WeakSet<object>
): unknown[] => {
  const set = value as Set<unknown>; // Cast to Set
  return simplifyArray(Array.from(set), depth, visited);
};

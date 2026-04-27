// objectifyError.ts: Handles errors and extracts relevant information

import { createSummary } from "./createSummary";
import { getTypeHandler } from "./getTypeHandler";
import { parseStackLine } from "./parseStackLine";

export const objectifyError = (
  value: unknown,
  depth: number,
  visited: WeakSet<object>
): Record<string, unknown> => {
  console.log("objectifyError", { value, depth, visited });
  const err = value as Error; // Cast to Error
  const result: Record<string, unknown> = {};
  if (depth <= 0) {
    return createSummary(err);
  }

  if (visited.has(err)) {
    return { summary: "[Circular Reference]" };
  }
  visited.add(err);

  const standardProps = ["message", "name", "stack"];
  standardProps.forEach((prop) => {
    const raw = (err as any)[prop];
    if (typeof raw === "string" && prop === "stack") {
      const lines = raw.split("\n").map((line) => line.trim());
      const stackParts = lines.map(parseStackLine);
      result[prop] = stackParts;
    } else if (raw !== undefined) {
      const handler = getTypeHandler(raw);
      result[prop] = handler ? handler(raw, depth - 1, visited) : raw;
    }
  });

  visited.delete(err);
  return result;
};

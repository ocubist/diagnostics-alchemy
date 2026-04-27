// Sort object keys deterministically
export const sortKeys = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj).sort(); // Sort keys alphabetically

  keys.forEach((key) => {
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sorted[key] = sortKeys(value as Record<string, unknown>);
    } else {
      sorted[key] = value;
    }
  });

  return sorted;
};

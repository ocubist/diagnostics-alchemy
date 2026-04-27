// Create a summary for objects or errors that exceed depth
export const createSummary = (val: unknown): Record<string, unknown> => {
  if (val instanceof Error) {
    return { summary: "[Error]" };
  }
  if (typeof val === "object" && val !== null) {
    return { summary: "[Object]" };
  }
  return { val };
};

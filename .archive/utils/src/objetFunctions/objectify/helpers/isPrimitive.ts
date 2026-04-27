// Check if a value is a primitive
export const isPrimitive = (val: unknown): boolean => {
  const type = typeof val;
  return (
    type === "string" ||
    type === "number" ||
    type === "bigint" ||
    type === "boolean" ||
    type === "undefined" ||
    val === null
  );
};

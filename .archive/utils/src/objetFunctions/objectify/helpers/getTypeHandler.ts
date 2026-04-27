import { isPrimitive } from "./isPrimitive";
import { objectifyError } from "./objectifyError";
import { simplifyArray } from "./simplifyArray";
import { simplifySet } from "./simplifySet";
import { simplifyMap } from "./simplifyMap";
import { simplifyObject } from "./simplifyObject";

export const getTypeHandler = (
  value: unknown
): ((val: unknown, depth: number, visited: WeakSet<object>) => any) | null => {
  if (isPrimitive(value)) {
    return (val) => val; // Primitive values are returned as-is
  }

  if (value instanceof Error) {
    return objectifyError; // Use the error-specific handler
  }

  if (Array.isArray(value)) {
    return simplifyArray; // Use a dedicated array handler
  }

  if (value instanceof Set) {
    return simplifySet; // Convert Set to an array and process recursively
  }

  if (value instanceof Map) {
    return simplifyMap; // Convert Map to an object and process recursively
  }

  if (typeof value === "object" && value !== null) {
    return simplifyObject; // Handle regular objects
  }

  // Ignore unsupported types like symbols and functions
  return null;
};

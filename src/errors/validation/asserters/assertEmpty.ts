import { useErrorAlchemy } from "../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy("diagnostics-alchemy", "assertEmpty");

export const AssertEmptyFailedError = craftMysticError({
  name: "AssertEmptyFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "Value was expected to be empty but was not",
});

export type AssertEmptyFailedError = InstanceType<typeof AssertEmptyFailedError>;

export type AssertEmptyValueType =
  | string
  | unknown[]
  | ArrayBufferView
  | Set<unknown>
  | Map<unknown, unknown>
  | Record<string, unknown>;

const getLength = (value: AssertEmptyValueType): number => {
  if (typeof value === "string" || Array.isArray(value) || ArrayBuffer.isView(value))
    return (value as { length: number }).length;
  if (value instanceof Set || value instanceof Map) return value.size;
  return Object.keys(value).length;
};

/** Asserts that `value` is empty (length/size === 0). */
export function assertEmpty<T extends AssertEmptyValueType>(value: T): void {
  const length = getLength(value);
  if (length > 0) {
    throw new AssertEmptyFailedError({
      message: `Empty-assertion failed: value has length/size ${length}.`,
      payload: { type: typeof value, length },
    });
  }
}

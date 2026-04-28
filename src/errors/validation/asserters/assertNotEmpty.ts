import { useErrorAlchemy } from "../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy("diagnostics-alchemy", "assertNotEmpty");

export const AssertNotEmptyFailedError = craftMysticError({
  name: "AssertNotEmptyFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "Value was empty but a non-empty value was expected",
});

export const AssertNotEmptyBoundsError = craftMysticError({
  name: "AssertNotEmptyBoundsError",
  errorCode: "RUNTIME_ERROR",
  severity: "critical",
  reason: "max must be >= min",
});

export type AssertNotEmptyFailedError = InstanceType<typeof AssertNotEmptyFailedError>;
export type AssertNotEmptyBoundsError = InstanceType<typeof AssertNotEmptyBoundsError>;

export type AssertNotEmptyValueType =
  | string
  | unknown[]
  | ArrayBufferView
  | Set<unknown>
  | Map<unknown, unknown>
  | Record<string, unknown>;

const getLength = (value: AssertNotEmptyValueType): number => {
  if (value == null) return 0;
  if (typeof value === "string" || Array.isArray(value) || ArrayBuffer.isView(value))
    return (value as { length: number }).length;
  if (value instanceof Set || value instanceof Map) return value.size;
  return Object.keys(value).length;
};

/** Asserts that `value` is non-empty, optionally within [min, max] bounds. */
export function assertNotEmpty<T extends AssertNotEmptyValueType>(
  value: T,
  min = 1,
  max?: number
): asserts value is NonNullable<T> {
  if (max !== undefined && max < min) {
    throw new AssertNotEmptyBoundsError({
      message: `Bounds invalid: max (${max}) is less than min (${min}).`,
      payload: { min, max },
    });
  }

  if (value == null) {
    throw new AssertNotEmptyFailedError({
      message: "NotEmpty-assertion failed: value is null or undefined.",
      payload: { type: typeof value },
    });
  }

  const length = getLength(value);

  if (length < min) {
    throw new AssertNotEmptyFailedError({
      message: `NotEmpty-assertion failed: length ${length} is below min ${min}.`,
      payload: { length, min, max },
    });
  }

  if (max !== undefined && length > max) {
    throw new AssertNotEmptyFailedError({
      message: `NotEmpty-assertion failed: length ${length} exceeds max ${max}.`,
      payload: { length, min, max },
    });
  }
}

import { useErrorAlchemy } from "../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy("diagnostics-alchemy", "assertDefined");

export const AssertDefinedFailedError = craftMysticError({
  name: "AssertDefinedFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "Value was null, undefined, or NaN",
});

export type AssertDefinedFailedError = InstanceType<typeof AssertDefinedFailedError>;

/** Asserts that `value` is not null, undefined, or NaN. */
export function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value == null || (typeof value === "number" && isNaN(value))) {
    throw new AssertDefinedFailedError({
      message: "Defined-assertion failed: value is null, undefined, or NaN.",
      payload: { value, type: typeof value },
    });
  }
}

import { useErrorAlchemy } from "../../crafting/useErrorAlchemy/useErrorAlchemy";

const { craftMysticError } = useErrorAlchemy("diagnostics-alchemy", "assertTruthy");

export const AssertTruthyFailedError = craftMysticError({
  name: "AssertTruthyFailedError",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "critical",
  reason: "Value was falsy",
});

export type AssertTruthyFailedError = InstanceType<typeof AssertTruthyFailedError>;

/** Asserts that `value` is truthy. */
export function assertTruthy<T>(value: T): asserts value is NonNullable<T> {
  if (!value) {
    throw new AssertTruthyFailedError({
      message: "Truthy-assertion failed: value was falsy.",
      payload: { value, type: typeof value },
    });
  }
}

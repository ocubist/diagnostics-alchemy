import { describe, it, expect } from "vitest";
import { z } from "zod";
import { assert, AssertFailedError } from "../../../src/errors/validation/asserters/assert";
import {
  assertDefined,
  AssertDefinedFailedError,
} from "../../../src/errors/validation/asserters/assertDefined";
import {
  assertTruthy,
  AssertTruthyFailedError,
} from "../../../src/errors/validation/asserters/assertTruthy";
import {
  assertFalsy,
  AssertFalsyFailedError,
} from "../../../src/errors/validation/asserters/assertFalsy";
import {
  assertEmpty,
  AssertEmptyFailedError,
} from "../../../src/errors/validation/asserters/assertEmpty";
import {
  assertNotEmpty,
  AssertNotEmptyFailedError,
  AssertNotEmptyBoundsError,
} from "../../../src/errors/validation/asserters/assertNotEmpty";
import { TransmutedError } from "../../../src/errors/transmuted-errors/TransmutedError";

// ─── assert ──────────────────────────────────────────────────────────────────

describe("assert (Zod schema asserter)", () => {
  const strSchema = z.string().min(3);

  it("does not throw when value matches the schema", () => {
    expect(() => assert("hello", strSchema)).not.toThrow();
  });

  it("throws AssertFailedError when value fails the schema", () => {
    expect(() => assert(42, strSchema)).toThrow(AssertFailedError);
    expect(() => assert("ab", strSchema)).toThrow(AssertFailedError);
  });

  it("includes validation details in the thrown error", () => {
    try {
      assert(99, strSchema);
    } catch (e) {
      expect(e).toBeInstanceOf(AssertFailedError);
      if (e instanceof TransmutedError) {
        expect(e.message.length).toBeGreaterThan(0);
        expect(e.payload).toHaveProperty("validationErrorDetails");
      }
    }
  });

  it("thrown error has DATA_INTEGRITY_VIOLATION code", () => {
    try {
      assert(0, strSchema);
    } catch (e) {
      if (e instanceof TransmutedError) {
        expect(e.errorCode).toBe("DATA_INTEGRITY_VIOLATION");
      }
    }
  });

  it("does nothing when no schema is provided", () => {
    expect(() => assert("any value")).not.toThrow();
  });
});

// ─── assertDefined ───────────────────────────────────────────────────────────

describe("assertDefined", () => {
  it("does not throw for a defined value", () => {
    let value: string | undefined = "hello";
    expect(() => assertDefined(value)).not.toThrow();
  });

  it("throws AssertDefinedFailedError for undefined", () => {
    let value: string | undefined;
    expect(() => assertDefined(value)).toThrow(AssertDefinedFailedError);
  });

  it("throws for null", () => {
    let value: string | null = null;
    expect(() => assertDefined(value)).toThrow(AssertDefinedFailedError);
  });

  it("narrows the type: value is T after assertion", () => {
    let value: number | undefined = 42;
    assertDefined(value);
    // If this compiles and doesn't throw, the assertion works
    const _doubled: number = value * 2;
    expect(_doubled).toBe(84);
  });
});

// ─── assertTruthy ─────────────────────────────────────────────────────────────

describe("assertTruthy", () => {
  it("passes for truthy values", () => {
    expect(() => assertTruthy(1)).not.toThrow();
    expect(() => assertTruthy("hello")).not.toThrow();
    expect(() => assertTruthy({})).not.toThrow();
    expect(() => assertTruthy([])).not.toThrow();
  });

  it("throws for falsy values", () => {
    expect(() => assertTruthy(0)).toThrow(AssertTruthyFailedError);
    expect(() => assertTruthy("")).toThrow(AssertTruthyFailedError);
    expect(() => assertTruthy(null)).toThrow(AssertTruthyFailedError);
    expect(() => assertTruthy(undefined)).toThrow(AssertTruthyFailedError);
    expect(() => assertTruthy(false)).toThrow(AssertTruthyFailedError);
  });
});

// ─── assertFalsy ─────────────────────────────────────────────────────────────

describe("assertFalsy", () => {
  it("passes for falsy values", () => {
    expect(() => assertFalsy(0)).not.toThrow();
    expect(() => assertFalsy("")).not.toThrow();
    expect(() => assertFalsy(null)).not.toThrow();
    expect(() => assertFalsy(undefined)).not.toThrow();
    expect(() => assertFalsy(false)).not.toThrow();
  });

  it("throws for truthy values", () => {
    expect(() => assertFalsy(1)).toThrow(AssertFalsyFailedError);
    expect(() => assertFalsy("text")).toThrow(AssertFalsyFailedError);
    expect(() => assertFalsy({})).toThrow(AssertFalsyFailedError);
  });
});

// ─── assertEmpty ─────────────────────────────────────────────────────────────

describe("assertEmpty", () => {
  it("passes for an empty string", () => {
    expect(() => assertEmpty("")).not.toThrow();
  });

  it("passes for an empty array", () => {
    expect(() => assertEmpty([])).not.toThrow();
  });

  it("passes for an empty Set", () => {
    expect(() => assertEmpty(new Set())).not.toThrow();
  });

  it("passes for an empty Map", () => {
    expect(() => assertEmpty(new Map())).not.toThrow();
  });

  it("passes for an empty object", () => {
    expect(() => assertEmpty({})).not.toThrow();
  });

  it("throws AssertEmptyFailedError for a non-empty string", () => {
    expect(() => assertEmpty("hello")).toThrow(AssertEmptyFailedError);
  });

  it("throws for a non-empty array", () => {
    expect(() => assertEmpty([1, 2, 3])).toThrow(AssertEmptyFailedError);
  });

  it("throws for a non-empty Set", () => {
    expect(() => assertEmpty(new Set([1]))).toThrow(AssertEmptyFailedError);
  });

  it("throws for a non-empty object", () => {
    expect(() => assertEmpty({ key: "value" })).toThrow(AssertEmptyFailedError);
  });
});

// ─── assertNotEmpty ───────────────────────────────────────────────────────────

describe("assertNotEmpty", () => {
  it("passes for a non-empty string", () => {
    expect(() => assertNotEmpty("hello")).not.toThrow();
  });

  it("passes for a non-empty array", () => {
    expect(() => assertNotEmpty([1, 2, 3])).not.toThrow();
  });

  it("passes for a non-empty Set", () => {
    expect(() => assertNotEmpty(new Set([1]))).not.toThrow();
  });

  it("passes for a non-empty Map", () => {
    expect(() => assertNotEmpty(new Map([["k", "v"]]))).not.toThrow();
  });

  it("passes for a non-empty object", () => {
    expect(() => assertNotEmpty({ a: 1 })).not.toThrow();
  });

  it("throws AssertNotEmptyFailedError for an empty string", () => {
    expect(() => assertNotEmpty("")).toThrow(AssertNotEmptyFailedError);
  });

  it("throws for an empty array", () => {
    expect(() => assertNotEmpty([])).toThrow(AssertNotEmptyFailedError);
  });

  it("throws for null", () => {
    expect(() => assertNotEmpty(null as never)).toThrow(AssertNotEmptyFailedError);
  });

  it("respects min bound", () => {
    expect(() => assertNotEmpty([1, 2], 3)).toThrow(AssertNotEmptyFailedError);
    expect(() => assertNotEmpty([1, 2, 3], 3)).not.toThrow();
  });

  it("respects max bound", () => {
    expect(() => assertNotEmpty([1, 2, 3, 4], 1, 3)).toThrow(AssertNotEmptyFailedError);
    expect(() => assertNotEmpty([1, 2], 1, 3)).not.toThrow();
  });

  it("throws AssertNotEmptyBoundsError when max < min", () => {
    expect(() => assertNotEmpty([1], 5, 2)).toThrow(AssertNotEmptyBoundsError);
  });
});

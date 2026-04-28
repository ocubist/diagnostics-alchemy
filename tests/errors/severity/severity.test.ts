import { describe, it, expect } from "vitest";
import { severitySelector } from "../../../src/errors/severity/severitySelector";
import { Severity } from "../../../src/errors/severity/types";
import { severityDescriptionMap } from "../../../src/errors/severity/severityDescriptionMap";

describe("severitySelector", () => {
  const expectedLevels = [
    "unimportant",
    "minor",
    "unexpected",
    "critical",
    "fatal",
    "catastrophic",
  ];

  it("exports all 6 severity levels", () => {
    expect(Object.values(severitySelector)).toHaveLength(6);
  });

  it("each level is present", () => {
    for (const level of expectedLevels) {
      expect(severitySelector).toHaveProperty(level, level);
    }
  });
});

describe("Severity zod enum", () => {
  it("accepts valid severity values", () => {
    for (const level of ["unimportant", "minor", "unexpected", "critical", "fatal", "catastrophic"]) {
      expect(Severity.safeParse(level).success).toBe(true);
    }
  });

  it("rejects invalid values", () => {
    expect(Severity.safeParse("high").success).toBe(false);
    expect(Severity.safeParse("").success).toBe(false);
  });
});

describe("severityDescriptionMap", () => {
  it("has a description for every severity level", () => {
    for (const level of Object.values(severitySelector)) {
      expect(severityDescriptionMap).toHaveProperty(level);
      expect(typeof severityDescriptionMap[level]).toBe("string");
      expect(severityDescriptionMap[level].length).toBeGreaterThan(0);
    }
  });
});

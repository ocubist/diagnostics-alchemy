// objects.test.ts: Tests for simplifyData function - Objects

import { simplifyData } from "../simplifyData";

describe("simplifyData - Objects", () => {
  it("should handle simple objects", () => {
    const simpleObject = { key1: "value1", key2: 42, key3: true };

    const result = simplifyData(simpleObject);

    expect(result).toEqual({
      key1: "value1",
      key2: 42,
      key3: true,
    });
  });

  it("should handle nested objects up to the depth limit", () => {
    const nestedObject = {
      level1: {
        level2: {
          level3: {
            key: "value",
          },
        },
      },
    };

    const result = simplifyData(nestedObject, 2);

    expect(result).toEqual({
      level1: {
        level2: { summary: "[Object]" },
      },
    });
  });

  it("should handle deeply nested objects with circular references", () => {
    const circularObject: Record<string, any> = {
      level1: {},
    };
    circularObject.level1.circular = circularObject; // Add circular reference

    const result = simplifyData(circularObject);

    expect(result).toEqual({
      level1: {
        circular: { summary: "[Circular Reference]" },
      },
    });
  });
});

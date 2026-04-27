// basic_values.test.ts: Tests for simplifyData function - Basic Values

import { simplifyData } from "../simplifyData";

describe("simplifyData - Basic Values", () => {
  it("should handle primitive values", () => {
    const primitives = [
      { input: "hello", expected: { val: "hello" } },
      { input: 42, expected: { val: 42 } },
      { input: true, expected: { val: true } },
      { input: null, expected: { val: null } },
      { input: undefined, expected: { val: undefined } },
      { input: BigInt(123456789), expected: { val: BigInt(123456789) } },
    ];

    primitives.forEach(({ input, expected }) => {
      expect(simplifyData(input)).toEqual(expected);
    });
  });

  it("should handle unexpected inputs gracefully", () => {
    const unexpectedInputs = [
      { input: Symbol("test"), expectedKey: "ERROR_OCCURRED" },
      { input: () => {}, expectedKey: "ERROR_OCCURRED" },
    ];

    unexpectedInputs.forEach(({ input, expectedKey }) => {
      const result = simplifyData(input);
      expect(result).not.toHaveProperty(expectedKey); // Symbols and functions are ignored
    });
  });
});

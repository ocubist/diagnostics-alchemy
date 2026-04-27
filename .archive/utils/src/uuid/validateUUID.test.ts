import { validateUUID } from "./validateUUID";

describe("validateUUID", () => {
  it("should return true for a valid UUID", () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000"; // Replace with a valid UUID
    expect(validateUUID(validUUID)).toBe(true);
  });

  it("should return false for an invalid UUID", () => {
    const invalidUUID = "invalid-uuid";
    expect(validateUUID(invalidUUID)).toBe(false);
  });

  // Additional tests can be added for edge cases or specific scenarios.
});

import { assertUUID } from "./assertUUID";
import { createUUID } from "./createUUID";

jest.mock("@ocubist/error-alchemy", () => {
  const mockCraftMysticError = jest.fn().mockImplementation(() => {
    function MockError(this: any, message: string) {
      this.message = message;
      this.name = "MockError";
    }
    MockError.prototype = Object.create(Error.prototype);
    return MockError;
  });

  return {
    useErrorAlchemy: jest.fn().mockReturnValue({
      craftMysticError: mockCraftMysticError,
    }),
  };
});

jest.mock("./validateUUID", () => ({
  validateUUID: jest.fn(),
}));

describe("assertUUID", () => {
  it("should not throw an error for a valid UUID", () => {
    require("./validateUUID").validateUUID.mockReturnValue(true);
    const validUUID = createUUID();
    expect(() => assertUUID(validUUID)).not.toThrow();
  });

  it("should throw a mock error for an invalid UUID", () => {
    require("./validateUUID").validateUUID.mockReturnValue(false);
    const invalidUUID = "invalid-uuid";
    expect(() => assertUUID(invalidUUID)).toThrow("MockError");
  });
});

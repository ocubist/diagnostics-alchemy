import { createUUID } from "./createUUID";
import { validate as uuidValidate } from "uuid";

describe("createUUID", () => {
  it("should generate a valid UUID", () => {
    const uuid = createUUID();
    expect(uuid).toBeDefined();
    expect(uuidValidate(uuid)).toBe(true);
  });

  // You can add more tests here if you want to test specific behaviors related to the options passed to the UUID v4 generator.
});

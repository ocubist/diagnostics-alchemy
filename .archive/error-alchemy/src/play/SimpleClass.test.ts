import { SimpleClass } from "./SimpleClass";

describe("SimpleClass", () => {
  test("should return 'WORKS ✌' from identifier getter", () => {
    const instance = new SimpleClass();
    console.log({ identifier: instance.identifier }); // Log for debugging
    expect(instance.identifier).toBe("WORKS ✌");
  });
});

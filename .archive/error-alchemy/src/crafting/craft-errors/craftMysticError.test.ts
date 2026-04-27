import { craftMysticError } from "./craftMysticError";

describe("craftMysticError", () => {
  it("should create a MysticError with the specified properties", () => {
    const TestMysticError = craftMysticError({
      name: "TestError",
    });

    const errorInstance = new TestMysticError({ message: "Test message" });

    expect(errorInstance.name).toBe("TestError");
    expect(errorInstance.message).toBe("Test message");
    expect(errorInstance).toBeInstanceOf(TestMysticError);
    expect(TestMysticError.compare(errorInstance)).toBe(true);
  });

  it("should have a unique dynamicClassUuid for each instance", () => {
    const MysticError1 = craftMysticError({
      name: "Error1",
    });

    const MysticError2 = craftMysticError({
      name: "Error2",
    });

    const errorInstance1 = new MysticError1({ message: "Message1" });
    const errorInstance2 = new MysticError2({ message: "Message2" });

    expect(errorInstance1.dynamicClassUuid).not.toBe(
      errorInstance2.dynamicClassUuid
    );
  });
});

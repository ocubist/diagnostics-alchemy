import { extractAllProperties } from "./extractAllProperties";

describe("extractAllProperties", () => {
  test("should extract regular properties", () => {
    const error = new Error("Regular error");
    (error as any).customProperty = "customValue";

    const result = extractAllProperties(error);

    expect(result.message).toBe("Regular error");
    expect(result.customProperty).toBe("customValue");
  });

  test("should handle inherited properties", () => {
    class ParentError extends Error {
      parentProperty = "parentValue";
    }

    class ChildError extends ParentError {
      childProperty = "childValue";
    }

    const error = new ChildError("Test error");
    const result = extractAllProperties(error);

    expect(result.parentProperty).toBe("parentValue");
    expect(result.childProperty).toBe("childValue");
  });

  test("should handle circular references gracefully", () => {
    const error1 = new Error("Error 1");
    const error2 = new Error("Error 2");

    (error1 as any).related = error2;
    (error2 as any).related = error1;

    const result = extractAllProperties(error1);

    expect(result.related).toBeDefined();
    expect(result.related.related).toBeUndefined(); // Circular reference ignored
  });

  test("should exclude functions, getters, and setters", () => {
    class CustomError extends Error {
      private _value = "hidden";

      get customGetter() {
        return `Getter: ${this._value}`;
      }

      set customSetter(value: string) {
        this._value = value;
      }

      customMethod() {
        return "I am a method";
      }
    }

    const error = new CustomError("Test error");
    const result = extractAllProperties(error);

    expect(result.customGetter).toBeUndefined();
    expect(result).not.toHaveProperty("_value");
    expect(result.customMethod).toBeUndefined();
  });

  test("should handle errors in properties gracefully", () => {
    const error = new Error("Test error");
    Object.defineProperty(error, "unreadableProperty", {
      get() {
        throw new Error("Cannot read property");
      },
    });

    const result = extractAllProperties(error);

    expect(result.unreadableProperty).toBe("[Unreadable Property]");
  });
});

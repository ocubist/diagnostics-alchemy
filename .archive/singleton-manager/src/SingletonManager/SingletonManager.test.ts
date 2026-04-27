import {
  useSingleton,
  SingletonDoesNotExistError,
  SingletonAlreadyExistsError,
  SingletonClearConfirmationError,
  SingletonFunctions,
} from "./SingletonManager"; // Adjust the import path as needed

describe("SingletonManager", () => {
  let singletonFunctions: SingletonFunctions;

  beforeEach(() => {
    singletonFunctions = useSingleton("testSingleton");
  });

  afterEach(() => {
    // Clear all singletons after each test
    try {
      singletonFunctions.clearSingletons("CONFIRM");
    } catch (e) {
      // Handle cases where singletons are already cleared
    }
  });

  test("setSingleton should create a new singleton", () => {
    const testSingleton = { data: "test" };
    singletonFunctions.setSingleton("test", testSingleton);
    expect(singletonFunctions.hasSingleton("test")).toBeTruthy();
  });

  test("getSingleton should retrieve an existing singleton", () => {
    const testSingleton = { data: "test" };
    singletonFunctions.setSingleton("test", testSingleton);
    expect(singletonFunctions.getSingleton("test")).toEqual(testSingleton);
  });

  test("setSingleton should throw SingletonAlreadyExistsError for existing singleton without force", () => {
    const testSingleton = { data: "test" };
    singletonFunctions.setSingleton("test", testSingleton);
    expect(() => {
      singletonFunctions.setSingleton("test", testSingleton);
    }).toThrow(SingletonAlreadyExistsError);
  });

  test("setSingletonIfNotExists should not override existing singleton", () => {
    const testSingleton = { data: "test" };
    singletonFunctions.setSingleton("test", testSingleton);
    singletonFunctions.setSingletonIfNotExists("test", () => ({ data: "new" }));
    expect(singletonFunctions.getSingleton("test")).toEqual(testSingleton);
  });

  test("hasSingleton should return true for existing singleton", () => {
    const testSingleton = { data: "test" };
    singletonFunctions.setSingleton("test", testSingleton);
    expect(singletonFunctions.hasSingleton("test")).toBeTruthy();
  });

  test("updateSingleton should update an existing singleton", () => {
    const testSingleton = { data: "test" };
    const updatedSingleton = { data: "updated" };
    singletonFunctions.setSingleton("test", testSingleton);
    singletonFunctions.updateSingleton("test", updatedSingleton);
    expect(singletonFunctions.getSingleton("test")).toEqual(updatedSingleton);
  });

  test("removeSingleton should remove an existing singleton", () => {
    const testSingleton = { data: "test" };
    singletonFunctions.setSingleton("test", testSingleton);
    singletonFunctions.removeSingleton("test");
    expect(() => {
      singletonFunctions.getSingleton("test");
    }).toThrow(SingletonDoesNotExistError);
  });

  test("clearSingletons should clear all singletons", () => {
    const testSingleton = { data: "test" };
    singletonFunctions.setSingleton("test", testSingleton);
    singletonFunctions.clearSingletons("CONFIRM");
    expect(() => {
      singletonFunctions.getSingleton("test");
    }).toThrow(SingletonDoesNotExistError);
  });

  test("clearSingletons should throw SingletonClearConfirmationError for invalid confirmation", () => {
    expect(() => {
      singletonFunctions.clearSingletons("INVALID_CONFIRMATION");
    }).toThrow(SingletonClearConfirmationError);
  });

  test("getAllSingletonKeys should return an array of all singleton keys", () => {
    const testSingleton1 = { data: "test1" };
    const testSingleton2 = { data: "test2" };
    singletonFunctions.setSingleton("test1", testSingleton1);
    singletonFunctions.setSingleton("test2", testSingleton2);
    expect(singletonFunctions.getAllSingletonKeys()).toEqual([
      "test1",
      "test2",
    ]);
  });

  test("registerInstanceAsSingleton should register a new instance and return a UUID", () => {
    const testInstance = { data: "instance" };
    const uuid = singletonFunctions.registerInstanceAsSingleton(testInstance);
    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe("string");
    expect(singletonFunctions.hasSingleton(uuid)).toBeTruthy();
  });

  test("unregisterInstanceAsSingleton should remove an instance registered by UUID", () => {
    const testInstance = { data: "instance" };
    const uuid = singletonFunctions.registerInstanceAsSingleton(testInstance);
    singletonFunctions.unregisterInstanceAsSingleton(uuid);
    expect(() => {
      singletonFunctions.getSingleton(uuid);
    }).toThrow(SingletonDoesNotExistError);
  });

  test("unregisterInstanceAsSingleton should not throw error for non-existent UUID", () => {
    expect(() => {
      singletonFunctions.unregisterInstanceAsSingleton("non-existent-uuid");
    }).not.toThrow();
  });
});

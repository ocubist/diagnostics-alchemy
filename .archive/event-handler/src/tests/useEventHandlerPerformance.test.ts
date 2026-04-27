import {
  useEventHandler,
  UseEventHandlerObject,
} from "../useEventHandler/useEventHandler";

describe("Performance tests for useEventHandler", () => {
  const testEventName = "testEvent";
  let testHandler: UseEventHandlerObject;
  const maximumAllowedTimeBaseMS = 500;
  const maximumAllowedTimeTenthMS = maximumAllowedTimeBaseMS / 10;

  beforeEach(() => {
    testHandler = useEventHandler(testEventName);
    testHandler.removeAllListeners(); // Clean up before each test
  });

  it("should measure the performance of adding listeners", () => {
    const listener = jest.fn();
    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      testHandler.on(listener);
    }

    const end = performance.now();
    const duration = end - start;
    console.log(
      `Add 10,000 listeners: ${duration} ms < ${maximumAllowedTimeBaseMS} ms`
    );
    expect(duration).toBeLessThan(maximumAllowedTimeBaseMS);
  });

  it("should measure the performance of emitting events", () => {
    const listener = jest.fn();
    for (let i = 0; i < 10000; i++) {
      testHandler.on(listener);
    }

    const start = performance.now();
    testHandler.emit("test data");
    const end = performance.now();
    const duration = end - start;
    console.log(
      `Emit event with 10,000 listeners: ${duration} ms < ${maximumAllowedTimeTenthMS} ms`
    );
    expect(duration).toBeLessThan(maximumAllowedTimeTenthMS);
  });

  it("should measure the performance of removing listeners", () => {
    const listener = jest.fn();
    for (let i = 0; i < 10000; i++) {
      testHandler.on(listener);
    }

    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      testHandler.off(listener);
    }

    const end = performance.now();
    const duration = end - start;
    console.log(
      `Remove 10,000 listeners: ${duration} ms < ${maximumAllowedTimeBaseMS} ms`
    );
    expect(duration).toBeLessThan(maximumAllowedTimeBaseMS);
  });

  it("should measure the performance of adding and emitting events with once", () => {
    const listener = jest.fn();
    const startAdd = performance.now();

    for (let i = 0; i < 10000; i++) {
      testHandler.once(listener);
    }

    const endAdd = performance.now();
    const durationAdd = endAdd - startAdd;
    console.log(
      `Add 10,000 once listeners: ${durationAdd} ms < ${maximumAllowedTimeBaseMS} ms`
    );
    expect(durationAdd).toBeLessThan(maximumAllowedTimeBaseMS);

    const startEmit = performance.now();
    testHandler.emit("test data");
    const endEmit = performance.now();
    const durationEmit = endEmit - startEmit;
    console.log(
      `Emit event with 10,000 once listeners: ${durationEmit} ms < ${maximumAllowedTimeTenthMS} ms`
    );
    expect(durationEmit).toBeLessThan(maximumAllowedTimeTenthMS);
  });

  it("should measure the performance of removing once listeners after emit", () => {
    const listener = jest.fn();
    for (let i = 0; i < 10000; i++) {
      testHandler.once(listener);
    }
    testHandler.emit("test data");

    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      testHandler.off(listener);
    }

    const end = performance.now();
    const duration = end - start;
    console.log(
      `Remove 10,000 once listeners after emit: ${duration} ms < ${maximumAllowedTimeBaseMS} ms`
    );
    expect(duration).toBeLessThan(maximumAllowedTimeBaseMS);
  });
});

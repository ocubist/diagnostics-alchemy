import {
  useEventHandler,
  getAllEvents,
  UseEventHandlerObject,
} from "./useEventHandler";

describe("useEventHandler", () => {
  const testEventName = "testEvent";
  let testHandler: UseEventHandlerObject;

  beforeEach(() => {
    testHandler = useEventHandler(testEventName);
    testHandler.removeAllListeners(); // Clean up before each test
  });

  it("should call an event listener when the event is emitted", () => {
    const mockListener = jest.fn();
    testHandler.on(mockListener);

    testHandler.emit("test data");
    expect(mockListener).toHaveBeenCalledWith("test data");
  });

  it("should call a listener only once when registered with once", () => {
    const mockListener = jest.fn();
    testHandler.once(mockListener);

    testHandler.emit();
    testHandler.emit();
    expect(mockListener).toHaveBeenCalledTimes(1);
  });

  it("should correctly remove a listener", () => {
    const mockListener = jest.fn();
    testHandler.on(mockListener);
    testHandler.off(mockListener);

    testHandler.emit();
    expect(mockListener).not.toHaveBeenCalled();
  });

  it("should remove all listeners", () => {
    const mockListener1 = jest.fn();
    const mockListener2 = jest.fn();
    testHandler.on(mockListener1);
    testHandler.on(mockListener2);
    testHandler.removeAllListeners();

    testHandler.emit();
    expect(mockListener1).not.toHaveBeenCalled();
    expect(mockListener2).not.toHaveBeenCalled();
  });

  it("should return correct listener count", () => {
    testHandler.on(() => {});
    testHandler.on(() => {});
    expect(testHandler.listenerCount()).toBe(2);
  });

  it("should return all event listeners", () => {
    const mockListener1 = jest.fn();
    const mockListener2 = jest.fn();
    testHandler.on(mockListener1);
    testHandler.on(mockListener2);
    expect(testHandler.getListeners()).toEqual([mockListener1, mockListener2]);
  });

  it("should track all emitted events", () => {
    const anotherEventHandler = useEventHandler("anotherEvent");
    testHandler.emit();
    anotherEventHandler.emit();
    const allEvents = getAllEvents();

    expect(getAllEvents()).toContain(testEventName);
    expect(getAllEvents()).toContain("anotherEvent");
  });

  it("should override on listener with once", () => {
    const mockListener = jest.fn();
    testHandler.on(mockListener);
    testHandler.once(mockListener);

    testHandler.emit();
    testHandler.emit();
    expect(mockListener).toHaveBeenCalledTimes(1);
  });

  it("should override once listener with on", () => {
    const mockListener = jest.fn();
    testHandler.once(mockListener);
    testHandler.on(mockListener);

    testHandler.emit();
    testHandler.emit();
    expect(mockListener).toHaveBeenCalledTimes(2);
  });

  // Add more tests as needed...
});

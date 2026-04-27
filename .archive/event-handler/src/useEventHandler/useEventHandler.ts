import { useSingleton } from "@ocubist/singleton-manager";
import { EventEmitter } from "events";

type EventListener<T = any> = (data: T) => void;

const { setSingletonIfNotExists } = useSingleton("@ocubist");

const getGlobalEventEmitter = () =>
  setSingletonIfNotExists<EventEmitter>(
    `global-event-emitter`,
    () => new EventEmitter()
  );

const getEventNamesMap = () =>
  setSingletonIfNotExists<Set<string>>(
    "global-event-emitter-events",
    () => new Set<string>()
  );

/**
 * Interface representing the event handler object.
 */
export interface UseEventHandlerObject {
  emit: <T = any>(data?: T | undefined) => void;
  on: <T = any>(listener: EventListener<T>) => void;
  once: <T = any>(listener: EventListener<T>) => void;
  off: <T = any>(listener: EventListener<T>) => void;
  listenerCount: () => number;
  getListeners: () => Function[];
  removeAllListeners: () => void;
}

/**
 * Custom hook to manage event handling with `on` and `once` listeners.
 *
 * @param eventName - The name of the event.
 * @returns The event handler object with methods to manage events.
 */
export const useEventHandler = (eventName: string): UseEventHandlerObject => {
  const eventEmitter = getGlobalEventEmitter();

  /**
   * Emits the event with optional data.
   *
   * @param data - Optional data to pass to the event listeners.
   */
  const emit = <T = any>(data?: T) => {
    eventEmitter.emit(`on:${eventName}`, data);
    eventEmitter.emit(`once:${eventName}`, data);
    const eventNames = getEventNamesMap();
    eventNames.add(eventName);
  };

  /**
   * Registers a persistent event listener.
   *
   * @param listener - The event listener to register.
   */
  const on = <T = any>(listener: EventListener<T>) => {
    if (!eventEmitter.listeners(`on:${eventName}`).includes(listener)) {
      if (eventEmitter.listeners(`once:${eventName}`).includes(listener)) {
        eventEmitter.off(`once:${eventName}`, listener);
      }
      eventEmitter.on(`on:${eventName}`, listener);
      const eventNames = getEventNamesMap();
      eventNames.add(eventName);
    }
  };

  /**
   * Registers a one-time event listener.
   *
   * @param listener - The event listener to register.
   */
  const once = <T = any>(listener: EventListener<T>) => {
    if (!eventEmitter.listeners(`once:${eventName}`).includes(listener)) {
      if (eventEmitter.listeners(`on:${eventName}`).includes(listener)) {
        eventEmitter.off(`on:${eventName}`, listener);
      }
      eventEmitter.once(`once:${eventName}`, listener);
      const eventNames = getEventNamesMap();
      eventNames.add(eventName);
    }
  };

  /**
   * Removes the event listener.
   *
   * @param listener - The event listener to remove.
   */
  const off = <T = any>(listener: EventListener<T>) => {
    eventEmitter.off(`on:${eventName}`, listener);
    eventEmitter.off(`once:${eventName}`, listener);
    if (
      eventEmitter.listenerCount(`on:${eventName}`) === 0 &&
      eventEmitter.listenerCount(`once:${eventName}`) === 0
    ) {
      const eventNames = getEventNamesMap();
      eventNames.delete(eventName);
    }
  };

  /**
   * Returns the count of listeners for the event.
   *
   * @returns The number of listeners.
   */
  const listenerCount = () => {
    return (
      eventEmitter.listenerCount(`on:${eventName}`) +
      eventEmitter.listenerCount(`once:${eventName}`)
    );
  };

  /**
   * Gets the list of listeners for the event.
   *
   * @returns The array of listeners.
   */
  const getListeners = () => {
    return [
      ...eventEmitter.listeners(`on:${eventName}`),
      ...eventEmitter.listeners(`once:${eventName}`),
    ];
  };

  /**
   * Removes all listeners for the event.
   */
  const removeAllListeners = () => {
    eventEmitter.removeAllListeners(`on:${eventName}`);
    eventEmitter.removeAllListeners(`once:${eventName}`);
    const eventNames = getEventNamesMap();
    eventNames.delete(eventName);
  };

  return {
    emit,
    on,
    once,
    off,
    listenerCount,
    getListeners,
    removeAllListeners,
  };
};

/**
 * Retrieves all event names.
 *
 * @returns An array of all event names.
 */
export const getAllEvents = () => {
  const eventNames = getEventNamesMap();
  return Array.from(eventNames);
};

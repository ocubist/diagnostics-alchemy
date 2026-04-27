import { assertDefined, useErrorAlchemy } from "@ocubist/error-alchemy";
import { createUUID } from "@ocubist/utils";

const { craftMysticError } = useErrorAlchemy(
  "singleton-manager",
  "SingletonManager-Class"
);

export const SingletonDoesNotExistError = craftMysticError({
  name: "SingletonDoesNotExistError",
  cause: "Tried to get a Singleton, that does not exist",
  errorCode: "DATA_VALUE_NOT_FOUND",
  severity: "unexpected",
});

export const SingletonClearConfirmationError = craftMysticError({
  name: "SingletonClearConfirmationError",
  cause: "Confirmation must be exactly 'CONFIRM'",
  errorCode: "VALIDATION_ERROR",
  severity: "unexpected",
});

export const SingletonAlreadyExistsError = craftMysticError({
  name: "SingletonAlreadyExistsError",
  cause:
    "Tried to set a singleton (without the force-flag), that already exists",
  errorCode: "DATA_INTEGRITY_VIOLATION",
  severity: "unexpected",
});

class SingletonHold {
  static singletons: Record<string, SingletonManager> = {};

  static getOrAdd(name: string) {
    if (!Object.hasOwnProperty.call(SingletonHold.singletons, name)) {
      SingletonHold.singletons[name] = new SingletonManager();
    }

    const singletonManager = SingletonHold.singletons[name];

    assertDefined(singletonManager);

    return singletonManager;
  }
}

class SingletonManager {
  private singletons: Record<string, unknown> = {};

  set<T>(name: string, singleton: T): void {
    this.singletons[name] = singleton;
  }

  get<T>(name: string): T {
    if (!this.has(name)) {
      throw new SingletonDoesNotExistError({
        message: `Singleton with name '${name}' not found`,
        payload: { name },
      });
    }
    return this.singletons[name] as T;
  }

  setIfNotExists<T>(name: string, factoryFunction: () => T): T {
    if (!this.has(name)) {
      this.set(name, factoryFunction());
    }
    return this.get(name);
  }

  has(name: string): boolean {
    return Object.hasOwnProperty.call(this.singletons, name);
  }

  remove(name: string): void {
    if (this.has(name)) {
      delete this.singletons[name];
    }
  }

  clear(confirmation: string): void {
    if (confirmation !== "CONFIRM") {
      throw new SingletonClearConfirmationError({
        message: `Confirmation '${confirmation}' invalid`,
        payload: { confirmation },
      });
    }
    this.singletons = {};
  }

  getAllKeys(): string[] {
    return Object.keys(this.singletons);
  }
}

// Define the interface
export interface SingletonFunctions {
  getSingleton<T>(name: string): T;
  setSingletonIfNotExists<T>(name: string, factoryFunction: () => T): T;
  setSingleton<T>(name: string, singleton: T, force?: boolean): void;
  hasSingleton(name: string): boolean;
  updateSingleton<T>(name: string, singleton: T): T;
  removeSingleton(name: string): void;
  registerInstanceAsSingleton(instance: unknown): string;
  unregisterInstanceAsSingleton(id: string): void;
  clearSingletons(confirmation: string): void;
  getAllSingletonKeys(): string[];
}

/**
 * Provides an interface to manage singletons by name. This function ensures that there is
 * only one instance of SingletonManager per name, and it provides methods to interact with
 * the singletons.
 *
 * @param name - The name of the singleton group to manage.
 * @returns An object containing methods to manage singletons within the specified group.
 *          This includes methods to set, get, check existence, update, remove, and clear
 *          singletons, as well as to register and unregister instances as singletons and
 *          retrieve all singleton keys.
 *
 * The returned object contains the following methods:
 * - getSingleton
 * - setSingletonIfNotExists
 * - setSingleton
 * - hasSingleton
 * - updateSingleton
 * - removeSingleton
 * - registerInstanceAsSingleton
 * - unregisterInstanceAsSingleton
 * - clearSingletons
 * - getAllSingletonKeys
 */
export const useSingleton = (name: string): SingletonFunctions => {
  const singletonManager = SingletonHold.getOrAdd(name);

  /**
   * Registers a singleton with a specified name.
   * If a singleton with the same name already exists and the `force` flag is not set,
   * an error is thrown.
   * @param name - The name of the singleton.
   * @param singleton - The singleton instance to register.
   * @param force - A boolean flag. If set to true, it will overwrite an existing singleton
   *                with the same name. Defaults to false.
   * @throws SingletonAlreadyExistsError - If a singleton with the same name already exists
   *                                       and `force` is false.
   */
  function setSingleton<T>(name: string, singleton: T, force = false): void {
    if (!singletonManager.has(name) || force) {
      singletonManager.set(name, singleton);
    } else {
      throw new SingletonAlreadyExistsError({
        message: `Singleton with name '${name}' already exists.`,
        payload: { name, singleton, force },
      });
    }
  }

  /**
   * Retrieves a singleton by its name.
   * @param name - The name of the singleton to retrieve.
   * @returns The singleton instance.
   * @throws Will throw an error if no singleton with the given name exists.
   */
  function getSingleton<T>(name: string): T {
    return singletonManager.get(name);
  }

  /**
   * Sets a singleton using a factory function if it doesn't exist, and returns it.
   * If the singleton already exists, it returns the existing instance.
   * @param name - The name of the singleton.
   * @param factoryFunction - A function that returns the singleton instance.
   * @returns The singleton instance.
   */
  function setSingletonIfNotExists<T>(
    name: string,
    factoryFunction: () => T
  ): T {
    return singletonManager.setIfNotExists(name, factoryFunction);
  }

  /**
   * Checks if a singleton exists by its name.
   * @param name - The name of the singleton to check.
   * @returns True if the singleton exists, false otherwise.
   */
  function hasSingleton(name: string): boolean {
    return singletonManager.has(name);
  }

  /**
   * Updates an existing singleton.
   * @param name - The name of the singleton to update.
   * @param singleton - The new singleton instance.
   * @returns The updated singleton instance.
   * @throws Will throw an error if no singleton with the given name exists.
   */
  function updateSingleton<T>(name: string, singleton: T): T {
    if (!singletonManager.has(name)) {
      throw new SingletonDoesNotExistError({
        message: `Singleton with name '${name}' not found`,
        payload: { name, singleton },
      });
    }
    singletonManager.set(name, singleton);
    return singleton;
  }

  /**
   * Removes a singleton by its name.
   * @param name - The name of the singleton to remove.
   */
  function removeSingleton(name: string): void {
    singletonManager.remove(name);
  }

  /**
   * Registers an instance as a singleton with a unique identifier.
   * @param instance - The instance to be registered as a singleton.
   * @returns A unique identifier (UUID) for the registered instance.
   */
  function registerInstanceAsSingleton(instance: unknown) {
    const id = createUUID();
    setSingleton(id, instance);
    return id;
  }

  /**
   * Unregisters a singleton instance using its unique identifier.
   * @param id - UUID of the singleton instance to unregister.
   */
  function unregisterInstanceAsSingleton(id: string) {
    removeSingleton(id);
  }

  /**
   * Clears all singletons from the manager.
   */
  function clearSingletons(confirmation: string): void {
    singletonManager.clear(confirmation);
  }

  /**
   * Retrieves all keys (names) of registered singletons.
   * @returns An array of singleton keys.
   */
  function getAllSingletonKeys(): string[] {
    return singletonManager.getAllKeys();
  }

  return {
    getSingleton,
    setSingletonIfNotExists,
    setSingleton,
    hasSingleton,
    updateSingleton,
    removeSingleton,
    registerInstanceAsSingleton,
    unregisterInstanceAsSingleton,
    clearSingletons,
    getAllSingletonKeys,
  };
};

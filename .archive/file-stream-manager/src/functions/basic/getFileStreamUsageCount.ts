import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { createOpenFileStreamKey } from "../../helpers/createOpenFileStreamKey";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";
import { OpenFileStreamSingletonObject } from "../../types/OpenFIleStreamSingletonObject";
import { useFileStreamManagerSingleton } from "../../config/useFileStreamManagerSingleton";
import { SingletonDoesNotExistError } from "@ocubist/singleton-manager";

const { getSingleton } = useFileStreamManagerSingleton();

const { craftMysticError } = useErrorAlchemy(
  "file-stream-manager",
  "openFileStream"
);

export const FileStreamToReadCounterDoesNotExistError = craftMysticError({
  name: "FileStreamToReadCounterDoesNotExistError",
  errorCode: "FILE_READ_ERROR",
  severity: "critical",
});

export const FileStreamDoesNotProvideCounterError = craftMysticError({
  name: "FileStreamDoesNotProvideCounterError",
  errorCode: "FILE_READ_ERROR",
  severity: "critical",
});

/**
 * Retrieves the usage count (subscription count) for a specific file stream.
 * This function checks the current usage count for an open file stream, which represents the number of active subscriptions.
 *
 * @param {string} filePath - The path to the file stream.
 * @returns {number} The usage count of the file stream.
 *
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 * @throws {SingletonDoesNotExistError} Thrown if the file stream does not exist.
 * @throws {FileStreamDoesNotProvideCounterError} Thrown if the file stream does not provide a counter, indicating it has never been subscribed to.
 * @throws {FileStreamToReadCounterDoesNotExistError} Thrown if the file stream to read counter from is not open.
 */
export const getFileStreamUsageCount = (filePath: string): number => {
  ensureNodeEnvironment();

  try {
    const key = createOpenFileStreamKey(filePath);
    const singleton = getSingleton<OpenFileStreamSingletonObject>(key);
    const counter = singleton.counter;

    if (!counter) {
      throw new FileStreamDoesNotProvideCounterError({
        message:
          "FileStream does not provide a counter, which means, it has never been subscribed to",
        payload: { filePath, counter },
      });
    }

    return counter;
  } catch (error) {
    if (SingletonDoesNotExistError.compare(error)) {
      throw new FileStreamToReadCounterDoesNotExistError({
        message: "FileStream to read counter from is not open",
        origin: error,
        payload: { filePath },
      });
    } else if (FileStreamDoesNotProvideCounterError.compare(error)) {
      throw error;
    } else {
      throw error;
    }
  }
};

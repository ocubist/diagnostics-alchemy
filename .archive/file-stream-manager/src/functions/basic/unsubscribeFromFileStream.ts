import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { useFileStreamManagerSingleton } from "../../config/useFileStreamManagerSingleton";
import { createOpenFileStreamKey as fileStreamKey } from "../../helpers/createOpenFileStreamKey";
import { OpenFileStreamSingletonObject } from "../../types/OpenFIleStreamSingletonObject";
import { closeFileStream } from "./closeFileStream";
import { SingletonDoesNotExistError } from "@ocubist/singleton-manager";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";

const { getSingleton } = useFileStreamManagerSingleton();

const { craftMysticError } = useErrorAlchemy(
  "file-stream-manager",
  "unsubscribeFromFileStream"
);

export const UnsubscribeFromFileStreamFailedError = craftMysticError({
  name: "UnsubscribeFromFileStreamFailedError",
  severity: "critical",
});

export const NoSubscriptionsFoundError = craftMysticError({
  name: "NoSubscriptionsFoundError",
  severity: "critical",
  cause:
    "The counter for the subscriptions to that fileStream was undefined, which indicates, that the fileStream was not created by using 'subscribeToFileStream'",
});

export const FileStreamToUnsubscribeDoesNotExist = craftMysticError({
  name: "FileStreamToUnsubscribeDoesNotExist",
  severity: "critical",
  cause:
    "The counter for the subscriptions to that fileStream was undefined, which indicates, that the fileStream was not created by using 'subscribeToFileStream'",
});

/**
 * Unsubscribes from a file stream, decrementing its usage counter.
 * If the counter reaches zero, the file stream is closed automatically.
 *
 * @param {string} filePath - Path to the file of the stream to unsubscribe from.
 * @returns {Promise<void>} A promise that resolves when the unsubscription is successful.
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 * @throws {NoSubscriptionsFoundError} Thrown if no subscriptions are found for the file stream.
 * @throws {FileStreamToUnsubscribeDoesNotExist} Thrown if the file stream to unsubscribe from does not exist.
 * @throws {UnsubscribeFromFileStreamFailedError} Thrown if an unexpected error occurs while unsubscribing from the file stream.
 */
export const unsubscribeFromFileStream = async (filePath: string) => {
  ensureNodeEnvironment();

  try {
    const key = fileStreamKey(filePath);
    const obj = getSingleton<OpenFileStreamSingletonObject>(key);

    if (obj.counter === undefined) {
      throw new NoSubscriptionsFoundError({
        message: "No subscriptions for that stream found.",
        payload: { filePath },
      });
    }

    obj.counter--;

    if (obj.counter <= 0) {
      // obj.instance.end();
      // obj.onExitCB();
      await closeFileStream(filePath);
    }
  } catch (err) {
    if (SingletonDoesNotExistError.compare(err)) {
      throw new FileStreamToUnsubscribeDoesNotExist({
        message: "No subscriptions for that stream found.",
        payload: { filePath },
        origin: err,
      });
    } else if (NoSubscriptionsFoundError.compare(err)) {
      throw err;
    } else {
      throw new UnsubscribeFromFileStreamFailedError({
        message: "Unexpected Error while unsubscribing from a FileStream",
        origin: err,
        payload: { filePath },
      });
    }
  }
};

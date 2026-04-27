import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { useFileStreamManagerSingleton } from "../../config/useFileStreamManagerSingleton";
import { createOpenFileStreamKey } from "../../helpers/createOpenFileStreamKey";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";
import { getAllFileStreamSingletonKeys } from "../../helpers/getAllFileStreamSingletonKeys";
import { OpenFileStreamSingletonObject } from "../../types/OpenFIleStreamSingletonObject";
import { openFileStream } from "./openFileStream";

const { getSingleton } = useFileStreamManagerSingleton();

const { craftMysticError } = useErrorAlchemy(
  "file-stream-manager",
  "subscribeToFileStream"
);

const SubscribeToFileStreamFailedError = craftMysticError({
  name: "SubscribeToFileStreamFailedError",
  severity: "critical",
});

/**
 * Subscribes to a file stream, incrementing its usage counter.
 * If the file stream is not already open, it will be opened automatically.
 *
 * @param {string} filePath - The path to the file of the stream.
 * @returns {Promise<void>} A promise that resolves when the subscription is successful.
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 * @throws {SubscribeToFileStreamFailedError} Thrown if an unexpected error occurs while subscribing to the file stream.
 */
export const subscribeToFileStream = async (filePath: string) => {
  ensureNodeEnvironment();

  const fileStreamKey = createOpenFileStreamKey(filePath);
  try {
    if (!getAllFileStreamSingletonKeys().includes(fileStreamKey)) {
      await openFileStream(filePath);
    }
    const obj = getSingleton<OpenFileStreamSingletonObject>(fileStreamKey);

    if (obj.counter === undefined) obj.counter = 1;
    else obj.counter++;
  } catch (err) {
    throw new SubscribeToFileStreamFailedError({
      message: `Unexpected Error subscribing to FileStream`,
      origin: err,
      payload: { filePath },
    });
  }
};

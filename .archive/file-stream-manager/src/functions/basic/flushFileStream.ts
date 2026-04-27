import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { useFileStreamManagerSingleton } from "../../config/useFileStreamManagerSingleton";
import { createOpenFileStreamKey as fileStreamKey } from "../../helpers/createOpenFileStreamKey";
import { OpenFileStreamSingletonObject } from "../../types/OpenFIleStreamSingletonObject";
import { SingletonDoesNotExistError } from "@ocubist/singleton-manager";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";

const { getSingleton } = useFileStreamManagerSingleton();

const { craftMysticError } = useErrorAlchemy(
  "file-stream-manager",
  "flushFileStream"
);

export const FlushFileStreamFailedError = craftMysticError({
  name: "FlushFileStreamFailedError",
  severity: "critical",
});

export const FileStreamToFlushDoesNotExistError = craftMysticError({
  name: "FileStreamToFlushDoesNotExistError",
  severity: "unimportant",
});

/**
 * Flushes a file stream's buffer.
 * Ensures that any data buffered in the stream is written to the file.
 *
 * @param {string} filePath - The path to the file of the stream to flush.
 * @param {(err?: Error | undefined) => unknown} [cb] - Optional callback function to execute after flushing.
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 * @throws {FileStreamToFlushDoesNotExistError} Thrown if the file stream to flush does not exist.
 * @throws {FlushFileStreamFailedError} Thrown if an unexpected error occurs while flushing the file stream.
 */
export const flushFileStream = (
  filePath: string,
  cb?: (err?: Error | undefined) => unknown
) => {
  ensureNodeEnvironment();

  try {
    getSingleton<OpenFileStreamSingletonObject>(
      fileStreamKey(filePath)
    ).instance.flush(cb);
  } catch (err) {
    if (SingletonDoesNotExistError.compare(err)) {
      throw new FileStreamToFlushDoesNotExistError({
        message: "FileStream to Flush doesn't exist",
        origin: err,
        payload: { filePath },
      });
    } else {
      throw new FlushFileStreamFailedError({
        message: "Something unexpected happened flushing the FileStream",
        origin: err,
        payload: { filePath },
      });
    }
  }
};

import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { useFileStreamManagerSingleton } from "../../config/useFileStreamManagerSingleton";
import { createOpenFileStreamKey as fileStreamKey } from "../../helpers/createOpenFileStreamKey";
import { OpenFileStreamSingletonObject } from "../../types/OpenFIleStreamSingletonObject";
import { getAllFileStreamSingletonKeys } from "../../helpers/getAllFileStreamSingletonKeys";
import { removeProcessListeners } from "../../helpers/removeProcessListeners";
import { SingletonDoesNotExistError } from "@ocubist/singleton-manager";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";

const { getSingleton } = useFileStreamManagerSingleton();

const { craftMysticError } = useErrorAlchemy(
  "file-stream-manager",
  "closeFileStream"
);

export const CloseFileStreamFailedError = craftMysticError({
  name: "CloseFileStreamFailedError",
  severity: "critical",
});

export const FileStreamNotFoundError = craftMysticError({
  name: "FileStreamNotFoundError",
  severity: "unimportant",
});

/**
 * Closes a file stream and removes it from the singleton manager.
 * Ensures that the file stream is properly closed, releasing any resources
 * associated with it and preventing memory leaks or resource exhaustion.
 *
 * @param {string} filePath - The path to the file whose stream should be closed.
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 * @throws {FileStreamNotFoundError} Thrown if the file stream to close is not found.
 * @throws {CloseFileStreamFailedError} Thrown if any unexpected error occurs during the closing process.
 */
export const closeFileStream = async (filePath: string) => {
  ensureNodeEnvironment();

  try {
    const singletonName = fileStreamKey(filePath);
    const { onExitCB } =
      getSingleton<OpenFileStreamSingletonObject>(singletonName);

    // Typecast onExitCB to ensure it's recognized as an async function
    await (onExitCB as () => Promise<void>)();

    if (getAllFileStreamSingletonKeys().length < 1) {
      removeProcessListeners();
    }
  } catch (err) {
    if (SingletonDoesNotExistError.compare(err)) {
      throw new FileStreamNotFoundError({
        message: "FileStream to close not found",
        origin: err,
        payload: {
          filePath,
        },
      });
    } else {
      throw new CloseFileStreamFailedError({
        message: `Unexpected error while closing the FileStream for file '${filePath}'`,
        origin: err,
        payload: { filePath },
      });
    }
  }
};

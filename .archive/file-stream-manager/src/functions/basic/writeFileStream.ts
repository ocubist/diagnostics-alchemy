import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { useFileStreamManagerSingleton } from "../../config/useFileStreamManagerSingleton";
import { createOpenFileStreamKey as fileStreamKey } from "../../helpers/createOpenFileStreamKey";
import { OpenFileStreamSingletonObject } from "../../types/OpenFIleStreamSingletonObject";
import { useEventHandler } from "@ocubist/event-handler";
import { config } from "../../config/config";
import { SingletonDoesNotExistError } from "@ocubist/singleton-manager";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";

const { getSingleton } = useFileStreamManagerSingleton();

const { craftMysticError } = useErrorAlchemy(
  "file-stream-manager",
  "writeFileStream"
);

export const WriteFileStreamFailedError = craftMysticError({
  name: "WriteFileStreamFailedError",
  errorCode: "FILE_WRITE_ERROR",
  severity: "critical",
});

export const FileStreamToWriteDoesNotExistError = craftMysticError({
  name: "WriteFileStreamFailedError",
  errorCode: "FILE_WRITE_ERROR",
  severity: "critical",
});

export const writeFileStreamEventHandler = useEventHandler(
  config.writeEventName
);

/**
 * Writes data to a file stream.
 *
 * This function writes a chunk of data to an open file stream. It requires that the file
 * stream is already opened, and if the stream does not exist, an error is thrown.
 * This ensures that the file stream is explicitly managed, avoiding resource leaks.
 *
 * After writing the data, an event is emitted using the event handler configured with
 * the event name specified in `config.writeEventName`. This allows other parts of the
 * application to react to file writes in a decoupled manner.
 *
 * @param {string} filePath - Path to the file where the data will be written.
 * @param {string} chunk - The data to write to the file.
 * @returns {boolean} Returns true if the data was successfully written, false if it was buffered.
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 * @throws {FileStreamToWriteDoesNotExistError} Thrown if the file stream to write to does not exist.
 * @throws {WriteFileStreamFailedError} Thrown if any unexpected error occurs while writing to the file stream.
 */

export const writeFileStream = (filePath: string, chunk: string): boolean => {
  ensureNodeEnvironment();

  try {
    const fileStream = getSingleton<OpenFileStreamSingletonObject>(
      fileStreamKey(filePath)
    );

    const res = fileStream.instance.write(chunk);

    writeFileStreamEventHandler.emit({ filePath, chunk });

    return res;
  } catch (err) {
    if (SingletonDoesNotExistError.compare(err)) {
      throw new FileStreamToWriteDoesNotExistError({
        message: "",
        origin: err,
        payload: { filePath },
      });
    } else {
      throw new WriteFileStreamFailedError({
        message: `UnexpectedError writing to the FileStream`,
        payload: { filePath, chunk },
        origin: err,
      });
    }
  }
};

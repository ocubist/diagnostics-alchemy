import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { ensureNodeEnvironment } from "../../helpers/ensureNodeEnvironment";

const { craftMysticError } = useErrorAlchemy(
  "file-stream-manager",
  "readFileStream"
);

export const ReadFileStreamFailedError = craftMysticError({
  name: "ReadFileStreamFailedError",
  severity: "critical",
});

export const FileToReadDoesNotExistError = craftMysticError({
  name: "FileToReadDoesNotExistError",
  severity: "critical",
});

/**
 * Reads a file and returns its content as a string.
 *
 * This function reads the entire content of a file at the specified path and returns it
 * as a string. It does not require an open file stream, making it suitable for simple
 * read operations.
 *
 * @param {string} filePath - The path to the file to read.
 * @returns {Promise<string>} A promise that resolves to the file content as a string.
 * @throws {NotNodeEnvironmentError} Thrown if the environment is not a Node.js server.
 * @throws {FileToReadDoesNotExistError} Thrown if the file to read does not exist.
 * @throws {ReadFileStreamFailedError} Thrown if any unexpected error occurs while reading the file.
 */
export const readFileStream = async (filePath: string): Promise<string> => {
  ensureNodeEnvironment();

  const fs = await import("fs/promises");

  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    if (
      typeof err === "object" &&
      (err as Object).hasOwnProperty("code") &&
      // @ts-ignore
      err.code === "ENOENT"
    ) {
      throw new FileToReadDoesNotExistError({
        message: "File to read does not exist",
        origin: err,
        payload: { filePath },
      });
    } else {
      throw new ReadFileStreamFailedError({
        message: "Unexpected Error trying to read a file",
        origin: err,
        payload: { filePath },
      });
    }
  }
};

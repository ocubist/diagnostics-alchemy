import { promises as fs } from "fs";
import path from "path";

/**
 * Ensures that all folders and the file exist at the provided file path.
 * If the file doesn't exist, it will be created along with any necessary directories.
 * @param filePath - The path of the file to create along with its directories.
 */
export const createFileAndFolderIfDoesntExist = async (filePath: string) => {
  const directory = path.dirname(filePath);

  // Ensure the directory exists
  await fs.mkdir(directory, { recursive: true });

  try {
    // Check if the file exists
    await fs.access(filePath, fs.constants.F_OK);
  } catch (error) {
    // If the file does not exist, create it
    await fs.writeFile(filePath, "", { flag: "wx" });
  }
};

import { promises as fs } from "fs";
import path from "path";

export const testFilesFolderPath = path.resolve(__dirname, "testFiles");
export const loremIpsumPath = path.resolve(
  testFilesFolderPath,
  "loremIpsum.txt"
);
export const hundredTestFilePaths = (() => {
  const paths: string[] = [];
  for (let i = 1; i <= 100; i++) {
    paths.push(path.resolve(testFilesFolderPath, `Test ${i}.txt`));
  }
  return paths;
})();
export const firstWord = `Exercitation`;
export const defaultLoremIpsumContent = `${firstWord} reprehenderit nulla nostrud sint incididunt qui cillum reprehenderit irure elit mollit. Elit consequat fugiat sit non officia velit nulla veniam mollit laboris commodo sunt tempor fugiat. Cupidatat minim adipisicing velit elit nisi quis. Magna minim tempor eu labore quis velit incididunt ex adipisicing fugiat laboris adipisicing. Eu nostrud fugiat duis ea ex sint ea nisi. Magna velit commodo laboris proident labore aute incididunt proident duis.

Velit eu et eu veniam aute dolor officia ipsum non duis pariatur duis. Quis ex est qui consectetur labore magna eu laborum culpa in irure culpa dolor. Do amet ea duis nulla. Officia culpa ea sunt culpa sunt esse magna exercitation consequat. Id dolore fugiat esse minim enim ea cupidatat nulla nulla. Commodo labore reprehenderit laboris ipsum irure deserunt aliquip esse. Fugiat deserunt duis velit aliqua occaecat sit minim laborum nisi officia culpa exercitation labore voluptate.`;

export const clearTestFiles = async () => {
  for (let i = 1; i <= 100; i++) {
    const filePath = path.resolve(testFilesFolderPath, `Test ${i}.txt`);
    await fs.writeFile(filePath, "");
  }
};

export default async function globalSetup() {
  try {
    await fs.rm(testFilesFolderPath, { recursive: true, force: true });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error removing testFiles folder: ${err.message}`);
      throw err;
    }
  }
}

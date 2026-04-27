/**
 * Checks if the current environment is Node.js.
 *
 * @returns {boolean} True if the current environment is Node.js, otherwise false.
 */
export const isNodeEnvironment = () =>
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

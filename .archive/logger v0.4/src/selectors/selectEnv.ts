export const selectEnv = {
  filePaths: () => process.env.LOGGER_FILE_PATH || undefined,
  defaultLevel: () => process.env.LOGGER_DEFAULT_LEVEL || undefined,
};

import { isDevelopment } from "@ocubist/utils";

const nodeEnv = process.env.NODE_ENV;

export const selectEnv = {
  apiUrls: () => process.env.LOGGER_API_URL || undefined,
  filePaths: () => process.env.LOGGER_FILE_PATH || undefined,
  defaultLevel: () => process.env.LOGGER_DEFAULT_LEVEL || undefined,
};

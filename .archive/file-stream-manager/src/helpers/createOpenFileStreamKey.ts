import { config } from "../config/config";

export const createOpenFileStreamKey = (filePath: string) => {
  return config.openStreamSingletonKeyPrefix + filePath;
};

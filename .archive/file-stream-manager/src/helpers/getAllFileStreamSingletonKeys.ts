import { useFileStreamManagerSingleton } from "../config/useFileStreamManagerSingleton";
import { config } from "../config/config";

const { getAllSingletonKeys } = useFileStreamManagerSingleton();

export const getAllFileStreamSingletonKeys = () => {
  return getAllSingletonKeys().filter((key) =>
    key.startsWith(config.openStreamSingletonKeyPrefix)
  );
};

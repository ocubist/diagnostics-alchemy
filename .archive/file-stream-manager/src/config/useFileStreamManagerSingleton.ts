import { useSingleton } from "@ocubist/singleton-manager";

export const useFileStreamManagerSingleton = () =>
  useSingleton("file-stream-manager");

import { isDevice, isServer } from "@ocubist/utils";

export const getCurrentOperatingEnv = () => {
  if (isDevice()) return "device";
  if (isServer()) return "server";

  throw new Error(
    "Could not identify currentOperatingEnv. It's seems the current Env is neither a server, nor a device. This should not have happened..."
  );
};

import { useErrorAlchemy } from "@ocubist/error-alchemy";
import { isServer } from "@ocubist/utils";

const NotNodeEnvironmentError = useErrorAlchemy(
  "File-Stream-Manager",
  "nodeEnvCheck"
).craftSynthesizedError({
  name: "NotNodeEnvironmentError",
  cause: "Thrown because the environment is not node-server.",
});

export const ensureNodeEnvironment = () => {
  if (!isServer()) {
    throw new NotNodeEnvironmentError({
      message:
        "The File-Stream-Manager is made for usage with a Node-Server-Environment.",
    });
  }
};

import { ObjectifiedError } from "../../types/ObjectifiedErrorType";

export const objectifyError = (err: unknown): ObjectifiedError => {
  // Handle Error instances
  if (err instanceof Error) {
    const objectifiedError: ObjectifiedError = {};

    if (err.name) objectifiedError.name = err.name;
    if (err.message) objectifiedError.message = err.message;
    if (err.stack) {
      objectifiedError.stack = err.stack
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "");
    }

    // @ts-ignore
    if (err.payload) objectifiedError.payload = err.payload;
    // @ts-ignore
    if (err.origin) objectifiedError.origin = objectifyError(err.origin);

    return objectifiedError;
  }

  // Handle null, undefined, or empty objects
  if (
    err === null ||
    err === undefined ||
    (typeof err === "object" && !Object.keys(err).length)
  ) {
    return {};
  }

  // @ts-ignore

  // Handle primitive values
  if (typeof err !== "object") {
    let errAsString = "Error is uncommon";

    try {
      errAsString = String(err);
    } catch {}

    return { errAsString, errType: typeof err }; // Convert to string
  }

  // Handle regular objects (non-Error)

  return { payload: err as Record<string, unknown> };
};

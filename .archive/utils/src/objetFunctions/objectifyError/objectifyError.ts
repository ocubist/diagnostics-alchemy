import { TransmutedError } from "@ocubist/error-alchemy";
import { compilerEnvKeyWords } from "../objectify/helpers/compilerEnvKeyWords";
import { extractAllProperties } from "./helpers/extractAllProperties";

export interface ObjectifyErrorOptions {
  cutCompilerStackTracing?: boolean;
  ignoreFunctions?: boolean;
  ignoreStack?: boolean;
  ignoreUndefined?: boolean;
  maxDepth?: number; // Add maxDepth to the options
}

export const objectifyError = (err: Error, options?: ObjectifyErrorOptions) => {
  // Default maxDepth if not provided
  const maxDepth = options?.maxDepth ?? 10;

  // Wrapper function that initializes seenObjects and handles recursion limit
  const innerObjectifyError = (
    err: Error,
    options: ObjectifyErrorOptions,
    seenObjects: Set<any>,
    currentDepth: number
  ): any => {
    if (seenObjects.has(err)) {
      return "[Circular]"; // Circular reference detected
    }

    if (currentDepth >= maxDepth) {
      return "[MaxDepthExceeded]"; // Exceeded recursion limit
    }

    seenObjects.add(err); // Track the object

    const errorObject = extractAllProperties(err);

    for (const key in errorObject) {
      // Remove undefined values if ignoreUndefined is set
      if (options?.ignoreUndefined && errorObject[key] === undefined) {
        delete errorObject[key];
      }
      // Recursively handle nested errors
      else if (errorObject[key] instanceof Error) {
        let newOptions = { ...options };
        if (key === "origin" && err instanceof TransmutedError) {
          newOptions = { ...newOptions, ignoreStack: true };
        }
        errorObject[key] = innerObjectifyError(
          errorObject[key],
          newOptions,
          seenObjects,
          currentDepth + 1
        );
      }
      // Handle stack trace filtering
      else if (key === "stack" && typeof errorObject[key] === "string") {
        if (options?.ignoreStack) {
          errorObject[key] = "[omitted]";
        } else if (options?.cutCompilerStackTracing) {
          let stackParts = errorObject[key].split("\n");
          const firstEnvIndex = stackParts.findIndex((line) =>
            compilerEnvKeyWords.some((keyword) => line.includes(keyword))
          );
          if (firstEnvIndex !== -1) {
            stackParts = stackParts.slice(0, firstEnvIndex);
          }
          errorObject[key] = stackParts.join("\n");
        }
      }
      // Optionally ignore functions
      else if (
        options?.ignoreFunctions &&
        typeof errorObject[key] === "function"
      ) {
        delete errorObject[key];
      }
    }

    return errorObject;
  };

  // Start recursion with an empty set for seenObjects and initial depth of 0
  return innerObjectifyError(err, options ?? {}, new Set(), 0);
};

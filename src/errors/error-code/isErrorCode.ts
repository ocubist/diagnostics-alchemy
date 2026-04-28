import { ErrorCode } from "./types";

/** Returns true if the given string is a valid ErrorCode. */
export const isErrorCode = (value: string): value is ErrorCode =>
  ErrorCode.safeParse(value).success;

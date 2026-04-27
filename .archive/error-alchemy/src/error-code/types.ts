import z from "zod";
import { errorCodeSelector } from "./errorCodeSelector";

// Helper type to extract values from a type
type ValueOf<T> = T[keyof T];

// Derive the ErrorCode type from the values of errorCodeSelector
export type ErrorCode = ValueOf<typeof errorCodeSelector>;

// * Zod-Schema
// Extract the values from errorCodeSelector into an array
const errorCodeValues = Object.values(errorCodeSelector) as ErrorCode[];

// Cast errorCodeValues to a tuple type expected by Zod
const errorCodeTuple: [ErrorCode, ...ErrorCode[]] =
  errorCodeValues as unknown as [ErrorCode, ...ErrorCode[]];

/**
 * Zod schema for validating error codes.
 */
export const ErrorCode = z.enum(errorCodeTuple);

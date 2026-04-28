import { z } from "zod";
import { errorCodeSelector } from "./errorCodeSelector";

type ValueOf<T> = T[keyof T];

export type ErrorCode = ValueOf<typeof errorCodeSelector>;

const errorCodeValues = Object.values(errorCodeSelector) as ErrorCode[];
const errorCodeTuple = errorCodeValues as unknown as [ErrorCode, ...ErrorCode[]];

export const ErrorCode = z.enum(errorCodeTuple);

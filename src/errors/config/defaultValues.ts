import { errorCodeSelector } from "../error-code/errorCodeSelector";
import { severitySelector } from "../severity/severitySelector";
import type { ErrorCode } from "../error-code/types";
import type { Severity } from "../severity/types";

export const DEFAULT_MODULE: string = "unknown_module";
export const DEFAULT_CONTEXT: string = "unknown_context";
export const DEFAULT_ERROR_CODE: ErrorCode = errorCodeSelector.UNKNOWN_ERROR;
export const DEFAULT_SEVERITY: Severity = severitySelector.unexpected;

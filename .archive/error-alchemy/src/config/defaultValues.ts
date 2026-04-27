import { severitySelector } from "../severity/severitySelector";
import { errorCodeSelector } from "../error-code/errorCodeSelector";
import { ErrorCode } from "../error-code/types";
import { Severity } from "../severity/types";

/**
 * Default module name used in error identifiers.
 * @type {string}
 */
export const DEFAULT_MODULE: string = "unknown_module";

/**
 * Default context used in error identifiers.
 * @type {string}
 */
export const DEFAULT_CONTEXT: string = "unknown_context";

/**
 * Default error code used in error identifiers.
 * @type {ErrorCode}
 */
export const DEFAULT_ERROR_CODE: ErrorCode = errorCodeSelector.UNKNOWN_ERROR;

/**
 * Default severity level for errors.
 * @type {Severity}
 */
export const DEFAULT_SEVERITY: Severity = severitySelector.unexpected;

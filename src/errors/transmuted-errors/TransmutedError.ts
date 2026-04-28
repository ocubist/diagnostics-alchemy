import { DEFAULT_ERROR_CODE, DEFAULT_SEVERITY } from "../config/defaultValues";
import { isErrorCode } from "../error-code/isErrorCode";
import type { ErrorCode } from "../error-code/types";
import { severityDescriptionMap } from "../severity/severityDescriptionMap";
import type { Severity } from "../severity/types";
import { createIdentifier } from "../utility/createIdentifier";
import type { Payload, TransmutedErrorProps } from "./types";

export class TransmutedError extends Error {
  readonly instanceUuid: string;
  readonly severity: Severity;
  readonly errorCode: ErrorCode;
  readonly reason: string | undefined;
  readonly payload: Payload;
  readonly module: string | undefined;
  readonly context: string | undefined;
  readonly origin: unknown;

  override name: string;

  get severityDescription(): string {
    return severityDescriptionMap[this.severity];
  }

  get identifier(): string {
    return createIdentifier({
      name: this.name,
      module: this.module,
      context: this.context,
      errorCode: this.errorCode,
    });
  }

  constructor(props: TransmutedErrorProps) {
    super(props.message);

    Object.setPrototypeOf(this, TransmutedError.prototype);

    // If origin is a TransmutedError, inherit its metadata as defaults
    // so that wrapping an existing typed error preserves its context.
    const originDefaults: Partial<TransmutedErrorProps> = {};
    if (props.origin instanceof TransmutedError) {
      originDefaults.reason = props.origin.reason;
      originDefaults.module = props.origin.module;
      originDefaults.context = props.origin.context;
      originDefaults.errorCode = props.origin.errorCode;
      originDefaults.severity = props.origin.severity;
    }

    const merged = { ...originDefaults, ...props };

    this.instanceUuid = crypto.randomUUID();
    this.name = merged.name;
    this.severity = merged.severity ?? DEFAULT_SEVERITY;
    this.origin = merged.origin;
    this.reason = merged.reason;
    this.payload = merged.payload ?? {};
    this.module = merged.module;
    this.context = merged.context;
    this.errorCode =
      merged.errorCode && isErrorCode(merged.errorCode)
        ? merged.errorCode
        : DEFAULT_ERROR_CODE;

    // Preserve origin stack so the trace points to the root cause.
    if (props.origin instanceof Error) {
      this.stack = props.origin.stack;
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    } else {
      this.stack = new Error(props.message).stack;
    }
  }
}

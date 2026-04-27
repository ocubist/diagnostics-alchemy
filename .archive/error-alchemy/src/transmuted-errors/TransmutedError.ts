import { DEFAULT_ERROR_CODE, DEFAULT_SEVERITY } from "../config/defaultValues";
import { isErrorCode } from "../error-code/isErrorCode";
import { ErrorCode } from "../error-code/types";
import { severityDescriptionMap } from "../severity/severityDescriptionMap";
import { Severity } from "../severity/types";
import { createIdentifier } from "../utility/createIdentifier";
import { Payload, TransmutedErrorProps } from "./types";

/**
 * Class representing a transmuted error.
 *
 * @extends Error
 */
export class TransmutedError extends Error {
  instanceUuid: string;
  name: string;
  severity: Severity;
  origin?: unknown;
  reason?: string;
  payload: Payload;
  module?: string;
  context?: string;
  errorCode: ErrorCode;

  /**
   * Get a description of the severity level.
   *
   * @returns {string} The severity description.
   */
  get severityDescription() {
    return severityDescriptionMap[this.severity];
  }

  /**
   * Get the unique identifier for the error.
   *
   * @returns {string} The unique identifier.
   */
  get identifier() {
    return createIdentifier({
      name: this.name,
      context: this.context,
      errorCode: this.errorCode,
      module: this.module,
    });
  }

  /**
   * Constructs a new TransmutedError.
   *
   * @param {TransmutedErrorProps} props - The properties of the transmuted error.
   */
  constructor(props: TransmutedErrorProps) {
    super(props.message);

    // * Set the prototype explicitly to ensure correct inheritance
    Object.setPrototypeOf(this, TransmutedError.prototype);

    // * Initialize temporary Props to collect Data
    let transmutedErrorProps: TransmutedErrorProps = {
      name: props.name,
      message: props.message,
    };

    // * If origin is provided and origin is Error
    const originProps: Partial<TransmutedErrorProps> = {};

    if (props.origin instanceof TransmutedError) {
      originProps.reason = props.origin.reason;
      originProps.module = props.origin.module;
      originProps.context = props.origin.context;
      originProps.errorCode = props.origin.errorCode;
      originProps.severity = props.origin.severity;
    }

    // * Fill the Member-Variables
    const {
      message,
      name,
      reason,
      errorCode,
      origin,
      payload,
      severity,
      context,
      module,
    } = { ...originProps, ...props };

    this.instanceUuid = crypto.randomUUID();
    this.name = name;
    this.severity = severity ?? DEFAULT_SEVERITY;
    this.origin = origin;
    this.reason = reason;
    this.payload = payload ?? {};
    this.module = module;
    this.context = context;

    if (errorCode && isErrorCode(errorCode)) {
      this.errorCode = errorCode;
    } else {
      this.errorCode = DEFAULT_ERROR_CODE;
    }

    // * Maintaining the correct stack trace
    if (origin instanceof Error) {
      this.stack = origin.stack;
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TransmutedError);
    } else {
      this.stack = new Error(transmutedErrorProps.message).stack;
    }
  }
}

import { ErrorCode } from "../error-code/types";

/**
 * Properties required to create an identifier.
 *
 * @typedef {Object} IdentifierProps
 * @property {string} name - The name part of the identifier.
 * @property {string} [module] - The module part of the identifier.
 * @property {string} [context] - The context part of the identifier.
 * @property {ErrorCode} [errorCode] - The error code part of the identifier.
 */
export interface IdentifierProps {
  name: string;
  module?: string;
  context?: string;
  errorCode?: ErrorCode;
}

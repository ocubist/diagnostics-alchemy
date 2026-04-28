import type { ErrorCode } from "../error-code/types";

export interface IdentifierProps {
  name: string;
  module?: string;
  context?: string;
  errorCode?: ErrorCode;
}

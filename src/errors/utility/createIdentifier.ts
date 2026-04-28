import { DEFAULT_CONTEXT, DEFAULT_MODULE } from "../config/defaultValues";
import { escapeIdentifierPart } from "./escapeIdentifierPart";
import type { IdentifierProps } from "./types";

/**
 * Builds the canonical identifier string for a TransmutedError:
 *   name/module/context/errorCode
 */
export const createIdentifier = (props: IdentifierProps): string => {
  const name = escapeIdentifierPart(props.name);
  const module = props.module ? escapeIdentifierPart(props.module) : DEFAULT_MODULE;
  const context = props.context ? escapeIdentifierPart(props.context) : DEFAULT_CONTEXT;
  const errorCode = props.errorCode ?? "UNKNOWN_ERROR";

  return `${name}/${module}/${context}/${errorCode}`;
};

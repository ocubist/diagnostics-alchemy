import { DEFAULT_CONTEXT, DEFAULT_MODULE } from "../config/defaultValues";
import { escapeIdentifierPart } from "./escapeIdentifierPart";
import { IdentifierProps } from "./types";

/**
 * Creates an identifier string from the given properties.
 * 
 * @param {IdentifierProps} props - The properties used to create the identifier.
 * @param {string} props.name - The name part of the identifier.
 * @param {string} [props.module] - The module part of the identifier. Defaults to DEFAULT_MODULE if not provided.
 * @param {string} [props.context] - The context part of the identifier. Defaults to DEFAULT_CONTEXT if not provided.
 * @param {ErrorCode} [props.errorCode] - The error code part of the identifier.
 * 
 * @returns {string} The constructed identifier.
 */
export const createIdentifier = (props: IdentifierProps) => {
  const name = escapeIdentifierPart(props.name);
  const errorCode = props.errorCode;
  const module = props.module
    ? escapeIdentifierPart(props.module)
    : DEFAULT_MODULE;
  const context = props.context
    ? escapeIdentifierPart(props.context)
    : DEFAULT_CONTEXT;

  return `${name}/${module}/${context}/${errorCode}`;
};

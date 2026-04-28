// ─── Error codes ─────────────────────────────────────────────────────────────
export { errorCodeSelector } from "./error-code/errorCodeSelector";
export { ErrorCode } from "./error-code/types";
export { isErrorCode } from "./error-code/isErrorCode";

// ─── Severity ─────────────────────────────────────────────────────────────────
export { severitySelector } from "./severity/severitySelector";
export { Severity } from "./severity/types";
export { severityDescriptionMap } from "./severity/severityDescriptionMap";

// ─── Config ───────────────────────────────────────────────────────────────────
export {
  DEFAULT_MODULE,
  DEFAULT_CONTEXT,
  DEFAULT_ERROR_CODE,
  DEFAULT_SEVERITY,
} from "./config/defaultValues";

// ─── Utility ──────────────────────────────────────────────────────────────────
export type { IdentifierProps } from "./utility/types";
export { escapeIdentifierPart } from "./utility/escapeIdentifierPart";
export { createIdentifier } from "./utility/createIdentifier";
export { popTraceStack } from "./utility/popTraceStack";
export {
  AlchemyPropsValidationError,
  extractZodErrorValidationDetails,
  stringifyZodErrorValidationDetails,
} from "./utility/PropsValidationError";
export type { ZodErrorValidationDetail } from "./utility/PropsValidationError";

// ─── Transmuted error types ───────────────────────────────────────────────────
export { Payload, TransmutedErrorProps } from "./transmuted-errors/types";
export type { } from "./transmuted-errors/types"; // re-export inferred types via z.infer already covered
export { TransmutedError } from "./transmuted-errors/TransmutedError";
export { MysticError } from "./transmuted-errors/MysticError";
export { SynthesizedError } from "./transmuted-errors/SynthesizedError";

// ─── Crafting: error factories ────────────────────────────────────────────────
export type {
  CraftErrorProps,
  CraftedErrorProps,
} from "./crafting/craft-errors/types";
export { craftMysticError } from "./crafting/craft-errors/craftMysticError";
export { craftSynthesizedError } from "./crafting/craft-errors/craftSynthesizedError";

// ─── Crafting: Transmuter ─────────────────────────────────────────────────────
export type {
  DetectorFunction,
  TransmuterFunction,
  Transmuter,
} from "./crafting/Transmuter/types";
export { craftErrorTransmuter } from "./crafting/Transmuter/craftErrorTransmuter";

// ─── Crafting: Synthesizer ────────────────────────────────────────────────────
export type {
  SynthesizerMiddlewareChain,
  Synthesizer,
} from "./crafting/Synthesizer/types";
export { craftErrorSynthesizer } from "./crafting/Synthesizer/craftErrorSynthesizer";

// ─── Crafting: Resolver ───────────────────────────────────────────────────────
export type { CraftErrorLoggerProps } from "./crafting/Resolver/craftErrorLogger";
export { craftErrorLogger } from "./crafting/Resolver/craftErrorLogger";
export { craftErrorResolverMap } from "./crafting/Resolver/craftErrorResolverMap";
export type { CraftErrorResolverProps } from "./crafting/Resolver/craftErrorResolver";
export { craftErrorResolver } from "./crafting/Resolver/craftErrorResolver";

// ─── useErrorAlchemy (primary entry point) ────────────────────────────────────
export type { AlchemyCraftErrorProps } from "./crafting/useErrorAlchemy/useErrorAlchemy";
export { useErrorAlchemy } from "./crafting/useErrorAlchemy/useErrorAlchemy";

// ─── Validation: asserters ────────────────────────────────────────────────────
export {
  AssertFailedError,
} from "./validation/asserters/assert";
export type { AssertFailedError as AssertFailedErrorInstance } from "./validation/asserters/assert";
export { assert } from "./validation/asserters/assert";

export {
  AssertDefinedFailedError,
} from "./validation/asserters/assertDefined";
export { assertDefined } from "./validation/asserters/assertDefined";

export {
  AssertTruthyFailedError,
} from "./validation/asserters/assertTruthy";
export { assertTruthy } from "./validation/asserters/assertTruthy";

export {
  AssertFalsyFailedError,
} from "./validation/asserters/assertFalsy";
export { assertFalsy } from "./validation/asserters/assertFalsy";

export { AssertEmptyFailedError } from "./validation/asserters/assertEmpty";
export type { AssertEmptyValueType } from "./validation/asserters/assertEmpty";
export { assertEmpty } from "./validation/asserters/assertEmpty";

export {
  AssertNotEmptyFailedError,
  AssertNotEmptyBoundsError,
} from "./validation/asserters/assertNotEmpty";
export type { AssertNotEmptyValueType } from "./validation/asserters/assertNotEmpty";
export { assertNotEmpty } from "./validation/asserters/assertNotEmpty";

// ─── Validation: parsers ──────────────────────────────────────────────────────
export { ParseFailedError, parse } from "./validation/parsers/parse";
export { AsyncParseFailedError, asyncParse } from "./validation/parsers/asyncParse";

// ─── Validation: validators ───────────────────────────────────────────────────
export { validate } from "./validation/validators/validate";
export { asyncValidate } from "./validation/validators/asyncValidate";

import { ObjectifiedError } from "..";

export type FormatStringFunction = (s: string) => string;
export type FormatObjectFunction = (o: object) => string;
export type FormatErrorFunction = (e: ObjectifiedError) => string;
export type FormatTraceFunction = (e: Array<string>) => string;
export type FormatNumberFunction = (n: number) => string;

export interface Formatters {
  primary: FormatStringFunction;
  type: FormatStringFunction;
  time: FormatNumberFunction;
  payload: FormatObjectFunction;
  trace: FormatTraceFunction;
  error: FormatErrorFunction;
  specializationName: FormatStringFunction;
  specializationPayload: FormatObjectFunction;
  msg: FormatStringFunction;
}

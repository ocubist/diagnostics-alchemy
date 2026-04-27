import { Payload } from "./PayloadType";

export type LoggerArgs =
  | [msg: string]
  | [payload: Payload]
  | [err: unknown]
  | [msg: string, payload: Payload]
  | [err: unknown, payload: Payload]
  | [msg: string, err: unknown]
  | [msg: string, err: unknown, payload: Payload];

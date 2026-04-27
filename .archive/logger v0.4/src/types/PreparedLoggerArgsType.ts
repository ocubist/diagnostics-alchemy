import { Payload } from "./PayloadType";

export interface PreparedLoggerArgs {
  msg?: string;
  payload?: Payload;
  err?: unknown;
  trace?: string[];
}

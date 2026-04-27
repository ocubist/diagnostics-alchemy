import { Payload } from "../export/PayloadType";

export interface PreparedLoggerArgs {
  msg?: string;
  payload?: Payload;
  err?: unknown;
  trace?: string[];
}

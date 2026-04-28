import type { MysticError } from "../../transmuted-errors/MysticError";
import type { SynthesizedError } from "../../transmuted-errors/SynthesizedError";

export type DetectorFunction = (err: unknown) => boolean;

export type TransmuterFunction<T = unknown> = (
  err: T
) => SynthesizedError | MysticError;

export interface Transmuter<T = unknown> {
  detect: DetectorFunction;
  transmute: TransmuterFunction<T>;
  execute: (err: unknown) => SynthesizedError | MysticError | unknown;
}

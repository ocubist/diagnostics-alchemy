import z from "zod";
import { MysticError } from "../../transmuted-errors/MysticError";
import { SynthesizedError } from "../../transmuted-errors/SynthesizedError";

/**
 * Zod schema for a detector function that checks if an error matches certain criteria.
 */
export const DetectorFunction = z.function(z.tuple([z.unknown()]), z.boolean());

/**
 * Type for a detector function that checks if an error matches certain criteria.
 * 
 * @typedef {Function} DetectorFunction
 * @param {unknown} err - The error to check.
 * @returns {boolean} True if the error matches the criteria, false otherwise.
 */
export type DetectorFunction = (err: unknown) => boolean;

/**
 * Zod schema for a transmuter function that transforms an error into either a SynthesizedError or a MysticError.
 */
export const TransmuterFunction = z.function(
  z.tuple([z.unknown()]),
  z.union([z.instanceof(SynthesizedError), z.instanceof(MysticError)])
);

/**
 * Type for a transmuter function that transforms an error into either a SynthesizedError or a MysticError.
 * 
 * @typedef {Function} TransmuterFunction
 * @template T
 * @param {T} err - The error to transform.
 * @returns {SynthesizedError|MysticError} The transformed error.
 */
export type TransmuterFunction<T = any> = (
  err: T
) => SynthesizedError | MysticError;

/**
 * Zod schema for a transmuter that contains a detector, a transmuter function, and an execute function.
 */
export const Transmuter = z.object({
  detect: DetectorFunction,
  transmute: TransmuterFunction,
  execute: z.function(z.tuple([z.unknown()]), z.unknown()),
});

/**
 * Interface for a transmuter that contains a detector, a transmuter function, and an execute function.
 * 
 * @typedef {Object} Transmuter
 * @template T
 * @property {DetectorFunction} detect - The function to detect errors.
 * @property {TransmuterFunction<T>} transmute - The function to transmute errors.
 * @property {(err: unknown) => unknown} execute - The function to execute the transmuter.
 */
export interface Transmuter<T = any> {
  detect: DetectorFunction;
  transmute: TransmuterFunction<T>;
  execute: (err: unknown) => MysticError | SynthesizedError | unknown;
}

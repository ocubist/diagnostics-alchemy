import type { DetectorFunction, Transmuter, TransmuterFunction } from "./types";

/**
 * Creates a Transmuter — a unit that detects a specific error type and converts it
 * into a typed MysticError or SynthesizedError.
 *
 * @example
 * const axiosTransmuter = craftErrorTransmuter(
 *   (err) => axios.isAxiosError(err),
 *   (err: AxiosError) => new HttpError({ message: err.message, origin: err })
 * );
 *
 * const typed = axiosTransmuter.execute(unknownError);
 */
export const craftErrorTransmuter = <T = unknown>(
  detectorFunction: DetectorFunction,
  transmuterFunction: TransmuterFunction<T>
): Transmuter<T> => ({
  detect: detectorFunction,
  transmute: transmuterFunction,
  execute(err: unknown) {
    return this.detect(err) ? this.transmute(err as T) : err;
  },
});

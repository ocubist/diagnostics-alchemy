import { DetectorFunction, Transmuter, TransmuterFunction } from "./types";
import { MysticError } from "../../transmuted-errors/MysticError";

/**
 * Crafts a new transmuter with the given detector and transmuter functions.
 *
 * @template T
 * @param {DetectorFunction} detectorFunction - The function to detect errors.
 * @param {TransmuterFunction<T>} transmuterFunction - The function to transmute errors.
 * @returns {Transmuter<T>} The crafted transmuter.
 */
export const craftErrorTransmuter = <T = any>(
  detectorFunction: DetectorFunction,
  transmuterFunction: TransmuterFunction<T>
): Transmuter<T> => {
  const newTransmuter: Transmuter<T> = {
    detect: detectorFunction,
    transmute: transmuterFunction,
    execute(err) {
      if (this.detect(err)) {
        return this.transmute(err as T);
      }
      return err;
    },
  };

  return newTransmuter;
};

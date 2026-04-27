import _ from "lodash";
import { PinoLogObject } from "../types/PinoLogObjType";

export function simplifyLogObject(
  logObject: PinoLogObject,
  maxDepth = 5
): PinoLogObject {
  const depthCounter = new WeakMap();

  const customizer = (value: any) => {
    if (_.isPlainObject(value) || Array.isArray(value)) {
      let depth = depthCounter.get(value) || 0;
      if (depth >= maxDepth) {
        return {}; // Return empty object at max depth
      }
      depthCounter.set(value, depth + 1); // Increment depth for child objects
    }
  };

  return _.cloneDeepWith(logObject, customizer);
}

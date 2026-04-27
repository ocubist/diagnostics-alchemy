import { getTypeHandler } from "./helpers/getTypeHandler";
import { isPrimitive } from "./helpers/isPrimitive";

export const simplifyData = (
  val: unknown,
  depth = 5
): Record<string, unknown> => {
  console.log("simplifyData", { val, depth });
  try {
    const handler = getTypeHandler(val);

    if (!handler) {
      // Unsupported types are ignored
      return {};
    }

    const result = handler(val, depth, new WeakSet());

    if (isPrimitive(result)) return { val: result };
    return result;
  } catch (e) {
    return { ERROR_OCCURRED: e, originalValue: val };
  }
};

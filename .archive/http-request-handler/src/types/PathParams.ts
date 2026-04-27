import { z } from "zod";

/**
 * Path parameters schema.
 */
export const PathParams = z.record(z.string());

/**
 * Path parameters type.
 */
export type PathParams = z.infer<typeof PathParams>;

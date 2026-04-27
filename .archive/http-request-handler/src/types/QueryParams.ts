import { z } from "zod";

/**
 * Query parameters schema.
 */
export const QueryParams = z.record(
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()])),
  ])
);

/**
 * Query parameters type.
 */
export type QueryParams = z.infer<typeof QueryParams>;

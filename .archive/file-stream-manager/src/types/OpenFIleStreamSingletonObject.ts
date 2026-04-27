import SonicBoom from "sonic-boom";
import { z } from "zod";

/**
 * Schema for validating the structure of the OpenFileStreamSingletonObject.
 */
export const OpenFileStreamSingletonObject = z.object({
  instance: z.instanceof(SonicBoom),
  onExitCB: z.function(),
  counter: z.number().optional(),
});

/**
 * Type definition for OpenFileStreamSingletonObject based on the schema.
 */
export type OpenFileStreamSingletonObject = z.infer<
  typeof OpenFileStreamSingletonObject
>;

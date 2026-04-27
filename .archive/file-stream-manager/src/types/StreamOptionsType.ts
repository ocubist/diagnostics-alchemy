import z from "zod";

/**
 * Schema for validating the structure of the FileStreamOptions.
 */
export const FileStreamOptions = z.object({
  sync: z.boolean().optional(),
  mkDir: z.boolean().optional(),
  minBufferSize: z.number().optional(),
  flushInterval: z.number().optional(),
});

/**
 * Type definition for FileStreamOptions based on the schema.
 */
export type FileStreamOptions = z.infer<typeof FileStreamOptions>;

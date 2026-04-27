import z from "zod";

export const SpecializationSchema = z.object({
  name: z.string(),
  payload: z.object({}).catchall(z.any()).optional(),
});

export type Specialization = z.infer<typeof SpecializationSchema>;

export const SpecializationsArraySchema = z.array(SpecializationSchema);

export type SpecializationsArray = z.infer<typeof SpecializationsArraySchema>;

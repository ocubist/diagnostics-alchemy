import z from "zod";

export const Specialization = z.object({
  name: z.string(),
  payload: z.object({}).catchall(z.any()).optional(),
});

export type Specialization = z.infer<typeof Specialization>;

export const SpecializationsArray = z.array(Specialization);

export type SpecializationsArray = z.infer<typeof SpecializationsArray>;

import z from "zod";
import { PayloadSchema } from "./PayloadType";

export const SpecializationSchema = z.object({
  name: z.string(),
  payload: PayloadSchema.optional(),
});

export type Specialization = z.infer<typeof SpecializationSchema>;

export const SpecializationsArraySchema = z.array(SpecializationSchema);

export type SpecializationsArray = z.infer<typeof SpecializationsArraySchema>;

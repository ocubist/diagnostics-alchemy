import z from "zod";
import { LoggerClassPropsSchema } from "../common/LoggerClassPropsType";

export const SpecializationOptionsSchema = LoggerClassPropsSchema.omit({
  specializations: true,
});

export type SpecializationOptions = z.infer<typeof SpecializationOptionsSchema>;

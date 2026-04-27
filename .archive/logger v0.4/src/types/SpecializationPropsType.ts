import z from "zod";
import { LoggerClassProps } from "./LoggerClassPropsType";

export const SpecializationOptions = LoggerClassProps.omit({
  specializations: true,
});

export type SpecializationOptions = z.infer<typeof SpecializationOptions>;

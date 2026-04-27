import z from "zod";
import { LoggerClassConfigSchema } from "./LoggerClassConfigType";

export const LoggerClassPropsSchema = LoggerClassConfigSchema.partial();

export type LoggerClassProps = z.infer<typeof LoggerClassPropsSchema>;

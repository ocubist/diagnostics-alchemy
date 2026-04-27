import z from "zod";
import { LoggerClassConfig } from "./LoggerClassConfigType";

export const LoggerClassProps = LoggerClassConfig.partial();

export type LoggerClassProps = z.infer<typeof LoggerClassProps>;

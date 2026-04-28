import { z } from "zod";
import { severitySelector } from "./severitySelector";

type ValueOf<T> = T[keyof T];

export type Severity = ValueOf<typeof severitySelector>;

const severityValues = Object.values(severitySelector) as Severity[];
const severityTuple = severityValues as unknown as [Severity, ...Severity[]];

export const Severity = z.enum(severityTuple);

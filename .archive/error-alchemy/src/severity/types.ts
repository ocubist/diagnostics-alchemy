import z from "zod";
import { severitySelector } from "./severitySelector";

// Helper type to extract values from a type
type ValueOf<T> = T[keyof T];

// Derive the Severity type from the values of severitySelector
export type Severity = ValueOf<typeof severitySelector>;

// * Zod-Schema
// Extract the values from severitySelector into an array
const values = Object.values(severitySelector) as Severity[];

// Cast values to a tuple type expected by Zod
const severityTuple: [Severity, ...Severity[]] = values as unknown as [
  Severity,
  ...Severity[]
];

/**
 * Zod schema for validating severity levels.
 */
export const Severity = z.enum(severityTuple);

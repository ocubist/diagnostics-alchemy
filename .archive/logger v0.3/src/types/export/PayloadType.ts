import z from "zod";

export const PayloadSchema = z.object({}).catchall(z.unknown());

export type Payload = z.infer<typeof PayloadSchema>;

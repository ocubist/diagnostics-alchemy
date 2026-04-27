import z from "zod";

export const Payload = z.object({}).catchall(z.unknown());

export type Payload = z.infer<typeof Payload>;

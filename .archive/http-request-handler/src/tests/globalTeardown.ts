// globalTeardown.ts
import { stopServer } from "./test-server";

export default async function globalTeardown() {
  await stopServer();
  // await delay(10000);
}

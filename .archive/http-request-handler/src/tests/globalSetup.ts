import { startServer } from "./test-server";

// globalSetup.ts
export default async function globalSetup() {
  await startServer(3000);
}

export const baseURL = "http://localhost:3000";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create connection only when POSTGRES_URL is available
const connectionString = process.env.POSTGRES_URL || "";

let db: ReturnType<typeof drizzle>;

if (connectionString) {
  const client = postgres(connectionString);
  db = drizzle(client, { schema });
} else {
  // During build time, create a mock db object to prevent errors
  db = {} as ReturnType<typeof drizzle>;
}

export { db };
export * from "./schema";
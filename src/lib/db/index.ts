import { createClient } from "@libsql/client";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: ReturnType<typeof drizzleLibsql> | ReturnType<typeof drizzlePostgres>;

if (process.env.NODE_ENV === "production" && process.env.POSTGRES_URL) {
  // Production: Use Vercel Postgres
  const client = postgres(process.env.POSTGRES_URL);
  db = drizzlePostgres(client, { schema });
} else {
  // Development: Use SQLite
  const client = createClient({
    url: "file:database.db",
  });
  db = drizzleLibsql(client, { schema });
}

export { db };
export * from "./schema";
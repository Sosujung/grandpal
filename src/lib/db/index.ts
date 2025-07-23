import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use a local Postgres database for development or production
const connectionString = process.env.POSTGRES_URL || "postgresql://localhost:5432/grandpal";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export * from "./schema";
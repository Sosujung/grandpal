import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: process.env.NODE_ENV === "production" ? "postgresql" : "sqlite",
  dbCredentials: process.env.NODE_ENV === "production" ? {
    url: process.env.POSTGRES_URL!,
  } : {
    url: "file:database.db",
  },
});
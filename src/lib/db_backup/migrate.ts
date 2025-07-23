import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

async function runMigration() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Database migrated successfully!");
}

runMigration().catch(console.error);
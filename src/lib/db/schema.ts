import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const dailyMoments = sqliteTable("daily_moments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  moments: text("moments", { mode: "json" }).$type<string[]>().notNull(),
  mood: text("mood").notNull(),
  recorded: integer("recorded", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type DailyMoment = typeof dailyMoments.$inferSelect;
export type NewDailyMoment = typeof dailyMoments.$inferInsert;
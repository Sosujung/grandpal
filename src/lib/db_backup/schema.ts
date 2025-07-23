import { pgTable, text, boolean, timestamp, json } from "drizzle-orm/pg-core";

export const dailyMoments = pgTable("daily_moments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  moments: json("moments").$type<string[]>().notNull(),
  mood: text("mood").notNull(),
  recorded: boolean("recorded").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export type DailyMoment = typeof dailyMoments.$inferSelect;
export type NewDailyMoment = typeof dailyMoments.$inferInsert;
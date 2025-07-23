CREATE TABLE "daily_moments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date" text NOT NULL,
	"moments" json NOT NULL,
	"mood" text NOT NULL,
	"recorded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT '2025-07-23 17:42:31.163' NOT NULL,
	"updated_at" timestamp DEFAULT '2025-07-23 17:42:31.163' NOT NULL
);

CREATE TABLE `daily_moments` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`moments` text NOT NULL,
	`mood` text NOT NULL,
	`recorded` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

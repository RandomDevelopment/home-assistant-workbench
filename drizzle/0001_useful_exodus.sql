CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`details` text NOT NULL,
	`context` text,
	`status` text DEFAULT 'new' NOT NULL,
	`reply` text DEFAULT '' NOT NULL,
	`issue_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `feedback_owner_created` ON `feedback` (`owner`,`created_at`);
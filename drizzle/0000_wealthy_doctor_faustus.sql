CREATE TABLE `changes` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`installation` text NOT NULL,
	`payload` text NOT NULL,
	`expires_at` integer NOT NULL,
	`claimed_at` integer
);
--> statement-breakpoint
CREATE TABLE `components` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`installation` text NOT NULL,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	`repo` text NOT NULL,
	`version` text NOT NULL,
	`docs` text,
	`notes` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `components_installation` ON `components` (`owner`,`installation`);--> statement-breakpoint
CREATE TABLE `installations` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`secret` text,
	`mode` text DEFAULT 'read' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`snapshot` text,
	`checked_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `installations_owner` ON `installations` (`owner`);--> statement-breakpoint
CREATE TABLE `oauth_states` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`installation` text NOT NULL,
	`nonce` text NOT NULL,
	`expires_at` integer NOT NULL
);

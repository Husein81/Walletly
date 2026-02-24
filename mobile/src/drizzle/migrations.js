import journal from "./meta/_journal.json";

const m0000 = `CREATE TABLE \`accounts\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`name\` text NOT NULL,
	\`balance\` real NOT NULL,
	\`imageUrl\` text NOT NULL,
	\`createdAt\` integer DEFAULT (unixepoch()) NOT NULL,
	\`updatedAt\` integer DEFAULT (unixepoch()) NOT NULL,
	\`userId\` text,
	FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE \`categories\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`name\` text NOT NULL,
	\`imageUrl\` text NOT NULL,
	\`type\` text DEFAULT 'EXPENSE' NOT NULL,
	\`createdAt\` integer DEFAULT (unixepoch()) NOT NULL,
	\`updatedAt\` integer DEFAULT (unixepoch()) NOT NULL,
	\`userId\` text,
	FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE \`expenses\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`description\` text,
	\`amount\` real NOT NULL,
	\`type\` text NOT NULL,
	\`createdAt\` integer DEFAULT (unixepoch()) NOT NULL,
	\`updatedAt\` integer DEFAULT (unixepoch()) NOT NULL,
	\`userId\` text,
	\`categoryId\` text,
	\`fromAccountId\` text,
	\`toAccountId\` text,
	FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`fromAccountId\`) REFERENCES \`accounts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`toAccountId\`) REFERENCES \`accounts\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE \`otps\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`phone\` text NOT NULL,
	\`code\` text NOT NULL,
	\`verified\` integer DEFAULT 0 NOT NULL,
	\`expiresAt\` integer NOT NULL,
	\`createdAt\` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX \`otp_phone_code_idx\` ON \`otps\` (\`phone\`,\`code\`);
--> statement-breakpoint
CREATE TABLE \`users\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`name\` text,
	\`phone\` text NOT NULL,
	\`phoneVerified\` integer DEFAULT 0 NOT NULL,
	\`email\` text,
	\`role\` text DEFAULT 'USER' NOT NULL,
	\`createdAt\` integer DEFAULT (unixepoch()) NOT NULL,
	\`updatedAt\` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`users_phone_unique\` ON \`users\` (\`phone\`);
--> statement-breakpoint
CREATE UNIQUE INDEX \`users_email_unique\` ON \`users\` (\`email\`);`;

const m0001 = `CREATE TABLE IF NOT EXISTS \`sessions\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`userId\` text NOT NULL,
	\`createdAt\` integer DEFAULT (unixepoch()) NOT NULL
);`;

const m0002 = `CREATE TABLE IF NOT EXISTS \`sessions\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`userId\` text NOT NULL,
	\`createdAt\` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS \`otp_phone_code_idx\`;`;

const m0003 = `PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE \`__new_sessions\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`userId\` text NOT NULL,
	\`createdAt\` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO \`__new_sessions\`("id", "userId", "createdAt") SELECT "id", "userId", "createdAt" FROM \`sessions\`;--> statement-breakpoint
DROP TABLE \`sessions\`;--> statement-breakpoint
ALTER TABLE \`__new_sessions\` RENAME TO \`sessions\`;--> statement-breakpoint
PRAGMA foreign_keys=ON;`;

export default {
  journal,
  migrations: {
    "0000_optimal_korath": m0000,
    "0001_add_sessions": m0001,
    "0002_broad_deathstrike": m0002,
    "0003_mushy_smiling_tiger": m0003,
  },
};

import { openDatabaseSync } from "expo-sqlite";
import { type SQLiteDatabase } from "expo-sqlite";

export const DATABASE_NAME = "walletly_db";
export const db = openDatabaseSync(DATABASE_NAME);

export const getDb = () => db;

// SQL statements for table creation (consolidated final schema)
const MIGRATIONS: string[] = [
  // users should be first for foreign key compliance
  `CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY NOT NULL,
    name text,
    phone text NOT NULL,
    phoneVerified integer DEFAULT 0 NOT NULL,
    email text,
    role text DEFAULT 'USER' NOT NULL,
    createdAt integer DEFAULT (unixepoch()) NOT NULL,
    updatedAt integer DEFAULT (unixepoch()) NOT NULL
  );`,
  `ALTER TABLE users ADD COLUMN currency text DEFAULT '$' NOT NULL;`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_phone_unique ON users (phone);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);`,

  // 0000_optimal_korath (initial create)
  `CREATE TABLE IF NOT EXISTS accounts (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    balance real NOT NULL,
    imageUrl text NOT NULL,
    createdAt integer DEFAULT (unixepoch()) NOT NULL,
    updatedAt integer DEFAULT (unixepoch()) NOT NULL,
    userId text,
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE no action ON DELETE set null
  );`,
  `CREATE TABLE IF NOT EXISTS categories (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    imageUrl text NOT NULL,
    type text DEFAULT 'EXPENSE' NOT NULL,
    createdAt integer DEFAULT (unixepoch()) NOT NULL,
    updatedAt integer DEFAULT (unixepoch()) NOT NULL,
    userId text,
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE no action ON DELETE set null
  );`,
  `CREATE TABLE IF NOT EXISTS expenses (
    id text PRIMARY KEY NOT NULL,
    description text,
    amount real NOT NULL,
    type text NOT NULL,
    createdAt integer DEFAULT (unixepoch()) NOT NULL,
    updatedAt integer DEFAULT (unixepoch()) NOT NULL,
    userId text,
    categoryId text,
    fromAccountId text,
    toAccountId text,
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (fromAccountId) REFERENCES accounts(id) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (toAccountId) REFERENCES accounts(id) ON UPDATE no action ON DELETE cascade
  );`,
  `CREATE TABLE IF NOT EXISTS otps (
    id text PRIMARY KEY NOT NULL,
    phone text NOT NULL,
    code text NOT NULL,
    verified integer DEFAULT 0 NOT NULL,
    expiresAt integer NOT NULL,
    createdAt integer DEFAULT (unixepoch()) NOT NULL
  );`,
  `CREATE INDEX IF NOT EXISTS otp_phone_code_idx ON otps (phone,code);`,

  // 0001_add_sessions + 0003_mushy_smiling_tiger (final sessions table)
  `CREATE TABLE IF NOT EXISTS sessions (
    id text PRIMARY KEY NOT NULL,
    userId text NOT NULL,
    createdAt integer DEFAULT (unixepoch()) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE no action ON DELETE cascade
  );`,

  // 0002_broad_deathstrike (DROP INDEX otp_phone_code_idx)
  `DROP INDEX IF EXISTS otp_phone_code_idx;`,

  // 0004_switch_to_email_auth
  `ALTER TABLE users ADD COLUMN emailVerified integer DEFAULT 0 NOT NULL;`,
  `ALTER TABLE otps ADD COLUMN email text;`,
  `UPDATE otps SET email = phone;`, // Migration for existing data if any
  `CREATE INDEX IF NOT EXISTS otp_email_code_idx ON otps (email,code);`,

  // 0005_email_password_auth
  `ALTER TABLE users ADD COLUMN password text;`,

  // 0006_fix_currency_json
  `UPDATE users SET currency = '{"code":"USD","symbol":"$","label":"US Dollar"}' WHERE currency = '$';`,

  // 0007_username_auth
  `ALTER TABLE users ADD COLUMN username text;`,
  `CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (username);`,

  // 0008_remove_phone_unique
  `DROP INDEX IF EXISTS users_phone_unique;`,
];

export const runMigrations = async (db: SQLiteDatabase) => {
  try {
    // Enable foreign keys
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Create migrations table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        createdAt INTEGER DEFAULT (unixepoch()) NOT NULL
      );
    `);

    // Check which migrations have run
    const existingMigrations = await db.getAllAsync<{ query: string }>(
      "SELECT query FROM _migrations",
    );
    const existingQueries = new Set(existingMigrations.map((m) => m.query));

    console.log(
      `Running migrations... Found ${existingQueries.size} already applied.`,
    );

    for (const query of MIGRATIONS) {
      if (!existingQueries.has(query)) {
        await db.runAsync(query);
        await db.runAsync("INSERT INTO _migrations (query) VALUES (?)", query);
        console.log(`Executed: ${query.substring(0, 50)}...`);
      }
    }

    // --- DEBUG LOGGING ---
    const users = await db.getAllAsync("SELECT id, username, email FROM users");
    console.log("📊 CURRENT USERS IN DB:", JSON.stringify(users, null, 2));

    const tableCounts = await db.getAllAsync(`
      SELECT 'accounts' as name, count(*) as count FROM accounts
      UNION ALL SELECT 'categories', count(*) FROM categories
      UNION ALL SELECT 'expenses', count(*) FROM expenses
    `);
    console.table(tableCounts);
    // -----------------------

    console.log("Migrations completed.");
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
};

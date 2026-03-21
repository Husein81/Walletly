import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";
import { ExpenseType, UserRole } from "./enums";

// Keep this schema aligned with the existing SQL migration runner in client.ts.
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    phone: text("phone").notNull(),
    phoneVerified: integer("phoneVerified", { mode: "boolean" })
      .notNull()
      .default(false),
    email: text("email"),
    emailVerified: integer("emailVerified", { mode: "boolean" })
      .notNull()
      .default(false),
    username: text("username"),
    password: text("password"),
    role: text("role", { enum: UserRole }).notNull().default("USER"),
    currency: text("currency").notNull().default("$"),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_username_unique").on(table.username),
  ],
);

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  balance: real("balance").notNull(),
  imageUrl: text("imageUrl").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  userId: text("userId").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  imageUrl: text("imageUrl").notNull(),
  type: text("type", { enum: ExpenseType }).notNull().default("EXPENSE"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  userId: text("userId").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey().notNull(),
  description: text("description"),
  amount: real("amount").notNull(),
  type: text("type", { enum: ExpenseType }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  userId: text("userId").references(() => users.id, {
    onDelete: "set null",
  }),
  categoryId: text("categoryId").references(() => categories.id, {
    onDelete: "cascade",
  }),
  fromAccountId: text("fromAccountId").references(() => accounts.id, {
    onDelete: "cascade",
  }),
  toAccountId: text("toAccountId").references(() => accounts.id, {
    onDelete: "cascade",
  }),
});

export const otps = sqliteTable(
  "otps",
  {
    id: text("id").primaryKey().notNull(),
    phone: text("phone").notNull(),
    code: text("code").notNull(),
    verified: integer("verified", { mode: "boolean" }).notNull().default(false),
    email: text("email"),
    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [index("otp_email_code_idx").on(table.email, table.code)],
);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const schema = {
  users,
  accounts,
  categories,
  expenses,
  otps,
  sessions,
};

export type DbUser = typeof users.$inferSelect;
export type DbAccount = typeof accounts.$inferSelect;
export type DbCategory = typeof categories.$inferSelect;
export type DbExpense = typeof expenses.$inferSelect;
export type DbOtp = typeof otps.$inferSelect;
export type DbSession = typeof sessions.$inferSelect;

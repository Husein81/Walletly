// schema/schema.ts
import {
  sqliteTable,
  text,
  real,
  integer,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { UserRole, ExpenseType } from "./enums";
import { generateUUID } from "./uuid";
import { sessions } from "./sessions";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),

  name: text("name"),
  phone: text("phone").notNull().unique(),
  phoneVerified: integer("phoneVerified", { mode: "boolean" })
    .default(false)
    .notNull(),

  email: text("email").unique(),
  role: text("role", { enum: UserRole }).default("USER").notNull(),

  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const otps = sqliteTable(
  "otps",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateUUID()),

    phone: text("phone").notNull(),
    code: text("code").notNull(),
    verified: integer("verified", { mode: "boolean" }).default(false).notNull(),

    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),

    createdAt: integer("createdAt", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (t) => ({
    phoneCodeIdx: index("otp_phone_code_idx").on(t.phone, t.code),
  }),
);

export const accounts = sqliteTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),

  name: text("name").notNull(),
  balance: real("balance").notNull(),
  imageUrl: text("imageUrl").notNull(),

  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

  userId: text("userId").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const expenses = sqliteTable("expenses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),

  description: text("description"),
  amount: real("amount").notNull(),

  type: text("type", { enum: ExpenseType }).notNull(),

  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

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

export const categories = sqliteTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),

  name: text("name").notNull(),
  imageUrl: text("imageUrl").notNull(),

  type: text("type", { enum: ExpenseType }).default("EXPENSE").notNull(),

  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

  userId: text("userId").references(() => users.id, {
    onDelete: "set null",
  }),
});

export { sessions };

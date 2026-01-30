// schema/relations.ts
import { relations } from "drizzle-orm";
import { users, accounts, expenses, categories } from "./schema";

export const userRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
  accounts: many(accounts),
  categories: many(categories),
}));

export const accountRelations = relations(accounts, ({ many }) => ({
  fromExpenses: many(expenses, { relationName: "fromAccount" }),
  toExpenses: many(expenses, { relationName: "toAccount" }),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  expenses: many(expenses),
}));

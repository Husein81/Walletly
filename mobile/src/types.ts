import { z } from "zod";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum ExpenseType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

// Schemas
export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(50),
  role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const categorySchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1).max(50),
  imageUrl: z.string().url().optional(),
  type: z.nativeEnum(ExpenseType).default(ExpenseType.EXPENSE),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const accountSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1).max(50),
  balance: z.number().default(0),
  imageUrl: z.string().url().optional(),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional(),
});

export const expenseSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  categoryId: z.string(),
  category: categorySchema,
  accountId: z.string(),
  account: accountSchema,
  description: z.string().max(255).optional(),
  amount: z.number().default(0),
  type: z.nativeEnum(ExpenseType),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof userSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Account = z.infer<typeof accountSchema>;

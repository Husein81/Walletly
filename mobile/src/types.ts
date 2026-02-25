import { symbol, z } from "zod";

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
  name: z.string().min(1).max(50).optional(),
  phone: z.string().min(6).optional(),
  phoneVerified: z.boolean().default(false),
  email: z.string().email().optional(),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
  currency: z
    .object({
      code: z.string(),
      symbol: z.string(),
      label: z.string(),
    })
    .default({ code: "USD", symbol: "$", label: "US Dollar" }),
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
  categoryId: z.string().optional(),
  category: categorySchema.optional(),
  fromAccountId: z.string(),
  fromAccount: accountSchema,
  toAccountId: z.string().optional(),
  toAccount: accountSchema.optional(),
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

// schema/enums.ts
export const UserRole = ["USER", "ADMIN"] as const;
export type UserRole = (typeof UserRole)[number];

export const ExpenseType = ["INCOME", "EXPENSE", "TRANSFER"] as const;
export type ExpenseType = (typeof ExpenseType)[number];

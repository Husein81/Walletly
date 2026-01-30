import { db } from "@/components/providers";
import { accounts, categories, expenses } from "@/db/schema";
import { generateUUID } from "@/db/uuid";
import { Expense } from "@/types";
import { and, desc, eq, gte, like, lt, or } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

type ExpenseType = "INCOME" | "EXPENSE" | "TRANSFER";

type CreateExpenseDto = {
  amount: number;
  description?: string;
  categoryId?: string;
  type: ExpenseType;
  userId: string;
  fromAccountId?: string;
  toAccountId?: string;
  updatedAt?: Date;
};

const fromAccounts = alias(accounts, "from_accounts");
const toAccounts = alias(accounts, "to_accounts");

export const expenseApi = {
  getExpenses: async ({
    userId,
    month,
    year,
    searchTerm,
  }: {
    userId: string;
    month?: string;
    year?: string;
    searchTerm?: string;
  }): Promise<Expense[]> => {
    const now = new Date();
    const y = year ? Number(year) : now.getFullYear();
    const m = month ? Number(month) - 1 : now.getMonth();

    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const results = await db
      .select({
        expense: expenses,
        category: categories,
        fromAccount: fromAccounts,
        toAccount: toAccounts,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .leftJoin(fromAccounts, eq(expenses.fromAccountId, fromAccounts.id))
      .leftJoin(toAccounts, eq(expenses.toAccountId, toAccounts.id))
      .where(
        and(
          eq(expenses.userId, userId),
          gte(expenses.updatedAt, start),
          lt(expenses.updatedAt, end),
          searchTerm
            ? or(
                like(categories.name, `%${searchTerm}%`),
                like(fromAccounts.name, `%${searchTerm}%`),
                like(toAccounts.name, `%${searchTerm}%`),
              )
            : undefined,
        ),
      )
      .orderBy(desc(expenses.updatedAt));

    return results.map((row) => ({
      ...row.expense,
      category: row.category,
      fromAccount: row.fromAccount,
      toAccount: row.toAccount,
    })) as Expense[];
  },
  getExpenseById: async (expenseId: string) => {
    const expense = await db.query.expenses.findFirst({
      where: eq(expenses.id, expenseId),
    });
    if (!expense) throw new Error("Expense not found");
    return expense;
  },
  createExpense: async (expense: CreateExpenseDto) => {
    const {
      amount,
      description,
      categoryId,
      type,
      userId,
      fromAccountId,
      toAccountId,
      updatedAt,
    } = expense;

    const date = updatedAt ?? new Date();

    return db.transaction(async (tx) => {
      // TRANSFER
      if (type === "TRANSFER") {
        if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
          throw new Error("Invalid transfer accounts");
        }

        const from = await tx.query.accounts.findFirst({
          where: eq(accounts.id, fromAccountId),
        });
        const to = await tx.query.accounts.findFirst({
          where: eq(accounts.id, toAccountId),
        });

        if (!from || !to) throw new Error("Account not found");

        const [expense] = await tx
          .insert(expenses)
          .values({
            id: generateUUID(),
            amount,
            description,
            userId,
            type,
            fromAccountId,
            toAccountId,
            updatedAt: date,
          })
          .returning();

        await tx
          .update(accounts)
          .set({ balance: from.balance - amount })
          .where(eq(accounts.id, fromAccountId));

        await tx
          .update(accounts)
          .set({ balance: to.balance + amount })
          .where(eq(accounts.id, toAccountId));

        return expense;
      }

      // INCOME / EXPENSE
      if (!fromAccountId) throw new Error("Missing account");

      const account = await tx.query.accounts.findFirst({
        where: eq(accounts.id, fromAccountId),
      });
      if (!account) throw new Error("Account not found");

      const balance =
        type === "INCOME" ? account.balance + amount : account.balance - amount;

      const [expense] = await tx
        .insert(expenses)
        .values({
          id: generateUUID(),
          amount,
          description,
          categoryId,
          userId,
          type,
          fromAccountId,
          updatedAt: date,
        })
        .returning();

      await tx
        .update(accounts)
        .set({ balance })
        .where(eq(accounts.id, fromAccountId));

      return expense;
    });
  },
  updateExpense: async (expense: CreateExpenseDto & { id: string }) => {
    const { id, amount, type, fromAccountId, toAccountId } = expense;

    return db.transaction(async (tx) => {
      const old = await tx.query.expenses.findFirst({
        where: eq(expenses.id, id),
      });
      if (!old) throw new Error("Expense not found");

      if (type === "TRANSFER") {
        if (!fromAccountId || !toAccountId) throw new Error("Invalid transfer");

        const delta = amount - old.amount;

        await tx
          .update(expenses)
          .set({ ...expense })
          .where(eq(expenses.id, id));

        await tx
          .update(accounts)
          .set({ balance: Number(accounts.balance) - delta })
          .where(eq(accounts.id, fromAccountId));

        await tx
          .update(accounts)
          .set({ balance: Number(accounts.balance) + delta })
          .where(eq(accounts.id, toAccountId));

        return;
      }

      if (!fromAccountId) throw new Error("Missing account");

      const diff =
        type === "INCOME" ? amount - old.amount : old.amount - amount;

      await tx
        .update(expenses)
        .set({ ...expense })
        .where(eq(expenses.id, id));

      await tx
        .update(accounts)
        .set({ balance: Number(accounts.balance) + diff })
        .where(eq(accounts.id, fromAccountId));
    });
  },
  deleteExpense: async (expenseId: string) => {
    await db.delete(expenses).where(eq(expenses.id, expenseId));
  },
};

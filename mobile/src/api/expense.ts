import { db } from "@/db/client";
import { generateUUID } from "@/db/uuid";
import { Expense, Category, Account } from "@/types";

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

export const expenseApi = {
  getExpenses: async ({
    userId,
    month,
    year,
    startDate,
    endDate,
    searchTerm,
  }: {
    userId: string;
    month?: string;
    year?: string;
    startDate?: Date;
    endDate?: Date;
    searchTerm?: string;
  }): Promise<Expense[]> => {
    let start: number, end: number;

    // Priority: Use startDate/endDate if provided, otherwise fall back to month/year
    if (startDate && endDate) {
      start = Math.floor(startDate.getTime() / 1000);
      end = Math.floor(endDate.getTime() / 1000);
    } else {
      const now = new Date();
      const y = year ? Number(year) : now.getFullYear();

      // If month is provided, use month range; otherwise use year range
      if (month) {
        const m = Number(month) - 1;
        start = Math.floor(new Date(y, m, 1).getTime() / 1000);
        end = Math.floor(new Date(y, m + 1, 1).getTime() / 1000);
      } else {
        // Year range: from Jan 1 to Dec 31
        start = Math.floor(new Date(y, 0, 1).getTime() / 1000);
        end = Math.floor(new Date(y + 1, 0, 1).getTime() / 1000);
      }
    }

    let query = `
      SELECT 
        e.id as e_id, e.description as e_description, e.amount as e_amount, e.type as e_type, e.createdAt as e_createdAt, e.updatedAt as e_updatedAt, e.userId as e_userId, e.categoryId as e_categoryId, e.fromAccountId as e_fromAccountId, e.toAccountId as e_toAccountId,
        c.id as c_id, c.name as c_name, c.imageUrl as c_imageUrl, c.type as c_type,
        fa.id as fa_id, fa.name as fa_name, fa.balance as fa_balance, fa.imageUrl as fa_imageUrl,
        ta.id as ta_id, ta.name as ta_name, ta.balance as ta_balance, ta.imageUrl as ta_imageUrl
      FROM expenses e
      LEFT JOIN categories c ON e.categoryId = c.id
      LEFT JOIN accounts fa ON e.fromAccountId = fa.id
      LEFT JOIN accounts ta ON e.toAccountId = ta.id
      WHERE e.userId = ? AND e.updatedAt >= ? AND e.updatedAt < ?
    `;

    const params: (string | number)[] = [userId, start, end];

    if (searchTerm) {
      query += ` AND (c.name LIKE ? OR fa.name LIKE ? OR ta.name LIKE ?)`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    }

    query += ` ORDER BY e.updatedAt DESC`;

    const rows = await db.getAllAsync<any>(query, params);

    return rows.map(
      (row) =>
        ({
          id: row.e_id,
          description: row.e_description,
          amount: row.e_amount,
          type: row.e_type,
          createdAt: new Date(row.e_createdAt * 1000),
          updatedAt: new Date(row.e_updatedAt * 1000),
          userId: row.e_userId,
          categoryId: row.e_categoryId,
          fromAccountId: row.e_fromAccountId,
          toAccountId: row.e_toAccountId,
          category: row.c_id
            ? ({
                id: row.c_id,
                name: row.c_name,
                imageUrl: row.c_imageUrl,
                type: row.c_type,
              } as Category)
            : undefined,
          fromAccount: row.fa_id
            ? ({
                id: row.fa_id,
                name: row.fa_name,
                balance: row.fa_balance,
                imageUrl: row.fa_imageUrl,
              } as Account)
            : undefined,
          toAccount: row.ta_id
            ? ({
                id: row.ta_id,
                name: row.ta_name,
                balance: row.ta_balance,
                imageUrl: row.ta_imageUrl,
              } as Account)
            : undefined,
        }) as Expense,
    );
  },

  getExpenseById: async (expenseId: string) => {
    const query = `SELECT * FROM expenses WHERE id = ? LIMIT 1`;
    const expense = await db.getFirstAsync<any>(query, [expenseId]);
    if (!expense) throw new Error("Expense not found");

    return {
      ...expense,
      createdAt: new Date(expense.createdAt * 1000),
      updatedAt: new Date(expense.updatedAt * 1000),
    } as Expense;
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

    const id = generateUUID();
    const date = updatedAt
      ? Math.floor(updatedAt.getTime() / 1000)
      : Math.floor(Date.now() / 1000);

    await db.withTransactionAsync(async () => {
      if (type === "TRANSFER") {
        if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
          throw new Error("Invalid transfer accounts");
        }

        const from = await db.getFirstAsync<Account>(
          "SELECT * FROM accounts WHERE id = ?",
          [fromAccountId],
        );
        const to = await db.getFirstAsync<Account>(
          "SELECT * FROM accounts WHERE id = ?",
          [toAccountId],
        );

        if (!from || !to) throw new Error("Account not found");

        await db.runAsync(
          `INSERT INTO expenses (id, amount, description, userId, type, fromAccountId, toAccountId, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, unixepoch(), ?)`,
          [
            id,
            amount,
            description || null,
            userId,
            type,
            fromAccountId,
            toAccountId,
            date,
          ],
        );

        await db.runAsync(
          "UPDATE accounts SET balance = balance - ?, updatedAt = ? WHERE id = ?",
          [amount, date, fromAccountId],
        );
        await db.runAsync(
          "UPDATE accounts SET balance = balance + ?, updatedAt = ? WHERE id = ?",
          [amount, date, toAccountId],
        );
      } else {
        // INCOME/EXPENSE
        if (!fromAccountId) throw new Error("Missing account");

        const account = await db.getFirstAsync<Account>(
          "SELECT * FROM accounts WHERE id = ?",
          [fromAccountId],
        );
        if (!account) throw new Error("Account not found");

        await db.runAsync(
          `INSERT INTO expenses (id, amount, description, categoryId, userId, type, fromAccountId, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, unixepoch(), ?)`,
          [
            id,
            amount,
            description || null,
            categoryId || null,
            userId,
            type,
            fromAccountId,
            date,
          ],
        );

        await db.runAsync(
          "UPDATE accounts SET balance = balance + ?, updatedAt = ? WHERE id = ?",
          [amount, date, fromAccountId],
        );
      }
    });

    const created = await db.getFirstAsync<any>(
      "SELECT * FROM expenses WHERE id = ?",
      [id],
    );
    return {
      ...created,
      createdAt: new Date(created.createdAt * 1000),
      updatedAt: new Date(created.updatedAt * 1000),
    } as Expense;
  },

  updateExpense: async (expense: Partial<Expense> & { id: string }) => {
    const { id } = expense;

    await db.withTransactionAsync(async () => {
      const old = await db.getFirstAsync<any>(
        "SELECT * FROM expenses WHERE id = ?",
        [id],
      );
      if (!old) throw new Error("Expense not found");

      // Logic to revert old balance effect and apply new one is needed for full correctness.
      // Implementing full logic here:

      const oldAmount = old.amount;
      const oldType = old.type;
      const oldFromAccountId = old.fromAccountId;
      const oldToAccountId = old.toAccountId;

      const newAmount = expense.amount ?? oldAmount;
      const newType = expense.type ?? oldType;
      const newFromAccountId = expense.fromAccountId ?? oldFromAccountId;
      const newToAccountId = expense.toAccountId ?? oldToAccountId;

      // 1. Revert old effect
      if (oldType === "TRANSFER") {
        if (oldFromAccountId)
          await db.runAsync(
            "UPDATE accounts SET balance = balance + ? WHERE id = ?",
            [oldAmount, oldFromAccountId],
          );
        if (oldToAccountId)
          await db.runAsync(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?",
            [oldAmount, oldToAccountId],
          );
      } else {
        // INCOME/EXPENSE
        if (oldFromAccountId) {
          await db.runAsync(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?",
            [oldAmount, oldFromAccountId],
          );
        }
      }

      // 2. Update Expense record
      const updates: string[] = [];
      const params: any[] = [];
      const fields = [
        "amount",
        "description",
        "categoryId",
        "type",
        "fromAccountId",
        "toAccountId",
      ];

      fields.forEach((field) => {
        // @ts-ignore
        if (expense[field] !== undefined) {
          updates.push(`${field} = ?`);
          // @ts-ignore
          params.push(expense[field]);
        }
      });

      if (expense.updatedAt) {
        updates.push("updatedAt = ?");
        params.push(Math.floor(new Date(expense.updatedAt).getTime() / 1000));
      }

      if (updates.length > 0) {
        params.push(id);
        await db.runAsync(
          `UPDATE expenses SET ${updates.join(", ")} WHERE id = ?`,
          params,
        );
      }

      // 3. Apply new effect
      if (newType === "TRANSFER") {
        if (newFromAccountId)
          await db.runAsync(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?",
            [newAmount, newFromAccountId],
          );
        if (newToAccountId)
          await db.runAsync(
            "UPDATE accounts SET balance = balance + ? WHERE id = ?",
            [newAmount, newToAccountId],
          );
      } else {
        // INCOME/EXPENSE
        if (newFromAccountId) {
          await db.runAsync(
            "UPDATE accounts SET balance = balance + ? WHERE id = ?",
            [newAmount, newFromAccountId],
          );
        }
      }
    });

    const updated = await db.getFirstAsync<any>(
      "SELECT * FROM expenses WHERE id = ?",
      [id],
    );
    return {
      ...updated,
      createdAt: new Date(updated.createdAt * 1000),
      updatedAt: new Date(updated.updatedAt * 1000),
    } as Expense;
  },

  deleteExpense: async (expenseId: string) => {
    // Should also revert balance changes ideally
    await db.withTransactionAsync(async () => {
      const old = await db.getFirstAsync<any>(
        "SELECT * FROM expenses WHERE id = ?",
        [expenseId],
      );
      if (!old) return; // already deleted

      const {
        amount: oldAmount,
        type: oldType,
        fromAccountId: oldFromAccountId,
        toAccountId: oldToAccountId,
      } = old;

      if (oldType === "TRANSFER") {
        if (oldFromAccountId)
          await db.runAsync(
            "UPDATE accounts SET balance = balance + ? WHERE id = ?",
            [oldAmount, oldFromAccountId],
          );
        if (oldToAccountId)
          await db.runAsync(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?",
            [oldAmount, oldToAccountId],
          );
      } else {
        if (oldFromAccountId) {
          await db.runAsync(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?",
            [oldAmount, oldFromAccountId],
          );
        }
      }

      await db.runAsync("DELETE FROM expenses WHERE id = ?", [expenseId]);
    });
  },
};

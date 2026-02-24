import { db } from "@/db/client";
import { generateUUID } from "@/db/uuid";
import { Account } from "@/types";

export const accountApi = {
  getAccounts: async (userId: string): Promise<Account[]> => {
    return await db.getAllAsync<Account>(
      "SELECT * FROM accounts WHERE userId = ? ORDER BY createdAt DESC",
      [userId],
    );
  },
  getAccount: async (accountId: string): Promise<Account> => {
    const account = await db.getFirstAsync<Account>(
      "SELECT * FROM accounts WHERE id = ?",
      [accountId],
    );

    if (!account) throw new Error("Account not found");
    return account;
  },
  createAccount: async (account: Omit<Account, "id">) => {
    const id = generateUUID();
    const imageUrl = account.imageUrl || "";

    await db.runAsync(
      `INSERT INTO accounts (id, name, balance, imageUrl, userId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, unixepoch(), unixepoch())`,
      [id, account.name, account.balance, imageUrl, account.userId!],
    );

    const created = await db.getFirstAsync<Account>(
      "SELECT * FROM accounts WHERE id = ?",
      [id],
    );
    if (!created) throw new Error("Failed to create account");
    return created;
  },
  updateAccount: async (account: Account) => {
    if (!account.id) throw new Error("Account ID required");

    await db.runAsync(
      `UPDATE accounts 
       SET name = ?, balance = ?, imageUrl = ?, updatedAt = unixepoch() 
       WHERE id = ?`,
      [account.name, account.balance, account.imageUrl || "", account.id],
    );

    const updated = await db.getFirstAsync<Account>(
      "SELECT * FROM accounts WHERE id = ?",
      [account.id],
    );

    if (!updated) throw new Error("Account not found after update");
    return updated;
  },
  deleteAccount: async (accountId: string) => {
    await db.runAsync("DELETE FROM accounts WHERE id = ?", [accountId]);
  },
};

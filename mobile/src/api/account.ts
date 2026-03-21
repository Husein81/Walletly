import { drizzleDb } from "@/db/client";
import { accounts } from "@/db/schema";
import { generateUUID } from "@/db/uuid";
import { Account } from "@/types";
import { desc, eq } from "drizzle-orm";

export const accountApi = {
  getAccounts: async (userId: string): Promise<Account[]> => {
    return (await drizzleDb
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))
      .orderBy(desc(accounts.createdAt))) as Account[];
  },
  getAccount: async (accountId: string): Promise<Account> => {
    const [account] = await drizzleDb
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (!account) throw new Error("Account not found");
    return account as Account;
  },
  createAccount: async (account: Omit<Account, "id">) => {
    const id = generateUUID();
    const imageUrl = account.imageUrl || "";

    await drizzleDb.insert(accounts).values({
      id,
      name: account.name,
      balance: account.balance,
      imageUrl,
      userId: account.userId!,
    });

    const [created] = await drizzleDb
      .select()
      .from(accounts)
      .where(eq(accounts.id, id))
      .limit(1);
    if (!created) throw new Error("Failed to create account");
    return created as Account;
  },
  updateAccount: async (account: Account) => {
    if (!account.id) throw new Error("Account ID required");

    await drizzleDb
      .update(accounts)
      .set({
        name: account.name,
        balance: account.balance,
        imageUrl: account.imageUrl || "",
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, account.id));

    const [updated] = await drizzleDb
      .select()
      .from(accounts)
      .where(eq(accounts.id, account.id))
      .limit(1);

    if (!updated) throw new Error("Account not found after update");
    return updated as Account;
  },
  deleteAccount: async (accountId: string) => {
    await drizzleDb.delete(accounts).where(eq(accounts.id, accountId));
  },
};

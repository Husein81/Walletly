import { db } from "@/components/providers";
import { accounts } from "@/db/schema";
import { Account } from "@/types";
import { desc, eq } from "drizzle-orm";

export const accountApi = {
  getAccounts: async (userId: string): Promise<Account[]> => {
    const response = (await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))
      .orderBy(desc(accounts.createdAt))) as Account[];
    return response;
  },
  getAccount: async (accountId: string): Promise<Account> => {
    const account = (await db.query.accounts.findFirst({
      where: eq(accounts.id, accountId),
    })) as Account;

    if (!account) throw new Error("Account not found");
    return account;
  },
  createAccount: async (account: Omit<Account, "id">) => {
    const [created] = await db
      .insert(accounts)
      .values({
        ...account,
        imageUrl: account.imageUrl || "",
      })
      .returning();
    return created;
  },
  updateAccount: async (account: Account) => {
    await accountApi.getAccount(account.id!);
    const [updated] = await db
      .update(accounts)
      .set({
        name: account.name,
        balance: account.balance,
        imageUrl: account.imageUrl || "",
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, account.id!))
      .returning();
    return updated;
  },
  deleteAccount: async (accountId: string) => {
    await accountApi.getAccount(accountId); // Ensure account exists
    await db.delete(accounts).where(eq(accounts.id, accountId));
  },
};

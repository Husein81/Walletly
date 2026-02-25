import { db } from "@/db/client";
import { User } from "@/types";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = () => generateUUID();

const seedUserData = async (userId: string) => {
  // Default Categories
  const categories = [
    { name: "Food", imageUrl: "food", type: "EXPENSE" },
    { name: "Shopping", imageUrl: "shopping", type: "EXPENSE" },
    { name: "Transportation", imageUrl: "transportation", type: "EXPENSE" },
    { name: "Health", imageUrl: "health", type: "EXPENSE" },
    { name: "Entertainment", imageUrl: "entertainment", type: "EXPENSE" },
    { name: "Salary", imageUrl: "handCoins", type: "INCOME" },
    { name: "Other", imageUrl: "other", type: "EXPENSE" },
  ];

  for (const cat of categories) {
    await db.runAsync(
      `INSERT INTO categories (id, name, imageUrl, type, userId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, unixepoch(), unixepoch())`,
      [generateUUID(), cat.name, cat.imageUrl, cat.type, userId],
    );
  }

  // Default Accounts
  const accounts = [
    { name: "Cash", balance: 0, imageUrl: "money" },
    { name: "Bank Account", balance: 0, imageUrl: "bank" },
  ];

  for (const acc of accounts) {
    await db.runAsync(
      `INSERT INTO accounts (id, name, balance, imageUrl, userId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, unixepoch(), unixepoch())`,
      [generateUUID(), acc.name, acc.balance, acc.imageUrl, userId],
    );
  }
};

const parseUser = (user: any): User => {
  let currency = { code: "USD", symbol: "$", label: "US Dollar" };

  if (user.currency) {
    try {
      currency =
        typeof user.currency === "string"
          ? JSON.parse(user.currency)
          : user.currency;

      // Handle the case where the parsed result is still just a symbol string (legacy)
      if (typeof currency === "string") {
        currency = { code: "USD", symbol: currency, label: "US Dollar" };
      }
    } catch (e) {
      // If it fails to parse (e.g. legacy '$' value), use default
      if (typeof user.currency === "string" && !user.currency.startsWith("{")) {
        currency = { code: "USD", symbol: user.currency, label: "US Dollar" };
      }
    }
  }

  return {
    ...user,
    currency,
  };
};

export const authApi = {
  checkUsername: async (username: string): Promise<{ exists: boolean }> => {
    const result = await db.getAllAsync<any>(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [username],
    );
    return { exists: result.length > 0 };
  },

  register: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    // Check if user already exists
    const existing = await authApi.checkUsername(username);
    if (existing.exists) throw new Error("Username already taken");

    const userId = generateUUID();
    await db.runAsync(
      `INSERT INTO users (id, username, password, phone, phoneVerified, role, createdAt, updatedAt) 
       VALUES (?, ?, ?, '', 0, 'USER', unixepoch(), unixepoch())`,
      [userId, username, password],
    );

    // Seed default data for new user
    await seedUserData(userId);

    const userResult = await db.getAllAsync<any>(
      "SELECT * FROM users WHERE id = ?",
      [userId],
    );
    const user = parseUser(userResult[0]);
    if (!user) throw new Error("Failed to create user");

    const token = generateToken();
    await db.runAsync(
      "INSERT INTO sessions (id, userId, createdAt) VALUES (?, ?, unixepoch())",
      [token, user.id!],
    );

    return { user, token };
  },

  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    // Find the user
    let userResult = await db.getAllAsync<any>(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username],
    );
    let user = userResult[0] ? parseUser(userResult[0]) : null;

    if (!user) {
      throw new Error("User not found");
    }

    // Check password
    if (userResult[0].password !== password) {
      throw new Error("Invalid password");
    }

    // Create session
    const token = generateToken();
    await db.runAsync(
      "INSERT INTO sessions (id, userId, createdAt) VALUES (?, ?, unixepoch())",
      [token, user.id!],
    );

    return { user, token };
  },

  completeRegistration: async ({
    userId,
    name,
    email,
  }: {
    userId: string;
    name: string;
    email: string;
  }) => {
    await db.runAsync(
      `UPDATE users 
       SET name = ?, email = ?, updatedAt = unixepoch() 
       WHERE id = ?`,
      [name, email, userId],
    );

    const updatedRes = await db.getAllAsync<User>(
      "SELECT * FROM users WHERE id = ?",
      [userId],
    );
    const updated = parseUser(updatedRes[0]);

    if (!updated) throw new Error("User not found after update");
    return updated;
  },

  updateProfile: async ({
    userId,
    name,
    email,
    username,
    currency,
  }: {
    userId: string;
    name?: string;
    email?: string;
    username?: string;
    currency?: User["currency"];
  }) => {
    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      params.push(email);
    }
    if (username !== undefined) {
      updates.push("username = ?");
      params.push(username);
    }
    if (currency !== undefined) {
      updates.push("currency = ?");
      params.push(JSON.stringify(currency));
    }

    if (updates.length > 0) {
      updates.push("updatedAt = unixepoch()");
      params.push(userId); // for WHERE clause

      await db.runAsync(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
    }

    const updatedRes = await db.getAllAsync<any>(
      "SELECT * FROM users WHERE id = ?",
      [userId],
    );
    const updated = parseUser(updatedRes[0]);

    if (!updated) throw new Error("User not found after update");
    return updated as User;
  },

  logout: async (token: string) => {
    try {
      await db.runAsync("DELETE FROM sessions WHERE id = ?", [token]);
    } catch (error) {
      console.warn("Error clearing session:", error);
    }
  },
};

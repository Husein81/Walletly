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

export const authApi = {
  sendOtp: async (phone: string): Promise<string> => {
    const code = generateOtp();
    // 5 minutes from now in unixepoch (matching other times)
    const expiresAt = Math.floor((Date.now() + 300 * 1000) / 1000);

    // Invalidate old OTPs for this phone
    await db.runAsync("DELETE FROM otps WHERE phone = ?", [phone]);

    // Insert new OTP
    await db.runAsync(
      `INSERT INTO otps (id, phone, code, verified, expiresAt, createdAt) 
       VALUES (?, ?, ?, 0, ?, unixepoch())`,
      [generateUUID(), phone, code, expiresAt],
    );

    return code;
  },

  verifyOtp: async ({
    phone,
    code,
  }: {
    phone: string;
    code: string;
  }): Promise<{ user: User; token: string }> => {
    // Find the OTP
    const result = await db.getAllAsync<{ id: string; expiresAt: number }>(
      "SELECT * FROM otps WHERE phone = ? AND code = ? LIMIT 1",
      [phone, code],
    );
    const otp = result[0];

    if (!otp) throw new Error("Invalid OTP");

    // Check expiration (compare with current unix timestamp)
    if (otp.expiresAt < Math.floor(Date.now() / 1000)) {
      throw new Error("OTP expired");
    }

    // Find the user
    let userResult = await db.getAllAsync<User>(
      "SELECT * FROM users WHERE phone = ? LIMIT 1",
      [phone],
    );
    let user = userResult[0];

    if (!user) {
      // Create new user
      const newUserId = generateUUID();
      await db.runAsync(
        `INSERT INTO users (id, phone, phoneVerified, role, createdAt, updatedAt) 
         VALUES (?, ?, 1, 'USER', unixepoch(), unixepoch())`,
        [newUserId, phone],
      );

      const newUserResult = await db.getAllAsync<User>(
        "SELECT * FROM users WHERE id = ?",
        [newUserId],
      );
      user = newUserResult[0];

      if (!user) throw new Error("Failed to create user");
    }

    // Mark OTP as verified
    await db.runAsync("UPDATE otps SET verified = 1 WHERE id = ?", [otp.id]);

    // Create session
    const token = generateToken();
    await db.runAsync(
      "INSERT INTO sessions (id, userId, createdAt) VALUES (?, ?, unixepoch())",
      [token, user.id],
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
    const updated = updatedRes[0];

    if (!updated) throw new Error("User not found after update");
    return updated;
  },

  updateProfile: async ({
    userId,
    name,
    email,
  }: {
    userId: string;
    name?: string;
    email?: string;
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

    if (updates.length > 0) {
      updates.push("updatedAt = unixepoch()");
      params.push(userId); // for WHERE clause

      await db.runAsync(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
    }

    const updatedRes = await db.getAllAsync<User>(
      "SELECT * FROM users WHERE id = ?",
      [userId],
    );
    const updated = updatedRes[0];

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

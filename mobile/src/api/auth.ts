import { db } from "@/components/providers";
import { otps, users } from "@/db/schema";
import { sessions } from "@/db/schema";
import { generateUUID } from "@/db/uuid";
import { User } from "@/types";
import { and, eq } from "drizzle-orm";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = () => generateUUID();

export const authApi = {
  sendOtp: async (phone: string): Promise<string> => {
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 300 * 1000); // 5 min

    // invalidate old OTPs
    await db.delete(otps).where(eq(otps.phone, phone));

    await db.insert(otps).values({
      phone,
      code,
      expiresAt,
      verified: false,
    });

    return code;
  },
  verifyOtp: async ({
    phone,
    code,
  }: {
    phone: string;
    code: string;
  }): Promise<{ user: User; token: string }> => {
    const otp = await db.query.otps.findFirst({
      where: and(eq(otps.phone, phone), eq(otps.code, code)),
    });

    if (!otp) throw new Error("Invalid OTP");
    if (otp.expiresAt.getTime() < Date.now()) throw new Error("OTP expired");

    let user = await db.query.users.findFirst({
      where: eq(users.phone, phone),
    });

    if (!user) {
      const [created] = await db
        .insert(users)
        .values({ phone, phoneVerified: true })
        .returning();
      user = created;
    }

    // mark OTP as used
    await db.update(otps).set({ verified: true }).where(eq(otps.id, otp.id));

    // 🔐 generate local session token
    const token = generateToken();

    await db.insert(sessions).values({
      id: token,
      userId: user.id,
    });

    return { user: user as User, token };
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
    const [updated] = await db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, userId))
      .returning();

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
    const [updated] = await db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, userId))
      .returning();

    return updated as User;
  },
  logout: async (token: string) => {
    try {
      // Delete session from database
      await db.delete(sessions).where(eq(sessions.id, token));
    } catch (error) {
      // Session might not exist, but logout should still succeed
      console.warn("Error clearing session:", error);
    }
  },
};

// Gold imports
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

// Local imports
import prisma from "../util/prisma.js";
import generateToken from "../util/generateToken.js";
import { User, UserRole } from "../types.js";
import UnauthenticatedError from "../error/unauthenticated.js";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;
  const code = generateCode();

  await prisma.otp.create({
    data: {
      phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 10 minutes
    },
  });

  res.status(200).json({
    message: "OTP sent successfully",
    code,
  });
};

const verifyOtp = async (
  req: Request<{}, {}, { phone: string; code: string }>,
  res: Response
) => {
  const { phone, code } = req.body;
  const otp = await prisma.otp.findFirst({
    where: {
      phone,
      code,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!otp) {
    res.status(401).json({ message: "Invalid or expired OTP" });
    return;
  }

  await prisma.otp.update({
    where: { id: otp.id },
    data: { verified: true },
  });

  let user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        phoneVerified: true,
        role: UserRole.USER,
      },
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      phoneVerified: true,
      updatedAt: new Date(),
    },
  });

  const token = generateToken(user.id);

  res.status(200).json({
    message: "OTP verified successfully",
    user,
    token,
  });
};

const completeRegistration = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { name, email } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      updatedAt: new Date(),
    },
  });

  res.status(200).json({
    message: "Registration completed successfully",
    user,
  });
};

export { sendOtp, verifyOtp, completeRegistration };

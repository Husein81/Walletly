// Gold imports
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

// Local imports
import prisma from "../util/prisma.js";
import generateToken from "../util/generateToken.js";
import { User, UserRole } from "../types.js";

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate token and set it in the cookie
    const token = generateToken(res, user.id);

    const { password: _, ...rest } = user;
    res.status(200).json({ user: rest, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as User;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate token and set it in the cookie
    const token = generateToken(res, newUser.id);

    const { password: _, ...rest } = newUser;
    res.status(201).json({ user: rest, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { login, register, logout };

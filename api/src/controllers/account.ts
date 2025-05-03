import { Request, Response } from "express";
import prisma from "../util/prisma.js";

const getAccounts = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      throw res
        .status(400)
        .json({ message: "Missing userId in query parameters." });
    }

    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;

    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      throw res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, imageUrl, balance } = req.body;

    const newAccount = await prisma.account.create({
      data: {
        name,
        imageUrl,
        balance,
        userId,
      },
    });

    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const { name, imageUrl, balance } = req.body;

    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        name,
        imageUrl,
        balance,
      },
    });

    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;

    await prisma.account.delete({
      where: {
        id: accountId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAccounts, getAccount, createAccount, updateAccount, deleteAccount };

// global imports
import { Request, Response } from "express";

// local imports
import prisma from "../util/prisma.js";
import { Expense } from "../types.js";
import NotFoundError from "../error/not-found.js";

const getExpenses = async (req: Request, res: Response) => {
  try {
    const { userId, month, year, searchTerm } = req.query as {
      userId: string;
      month?: string;
      year?: string;
      searchTerm?: string;
    };

    const parsedYear = year ? parseInt(year, 10) : new Date().getFullYear();
    const parsedMonth = month ? parseInt(month, 10) : new Date().getMonth() + 1;
    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 1); // start of next month

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
        OR: searchTerm
          ? [
              {
                category: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
              {
                account: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            ]
          : undefined,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        category: true,
        account: true,
      },
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createExpense = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      description,
      categoryId,
      type,
      userId,
      accountId,
      updatedAt,
    } = req.body as Expense;

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const newBalance = Number(account.balance) + Number(amount);

    const newExpense = await prisma.expense.create({
      data: {
        amount,
        description: description || "",
        userId,
        categoryId,
        type,
        createdAt: new Date(),
        updatedAt: updatedAt || new Date(),
        accountId,
      },
    });

    // Update the account balance
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    const { amount, description, categoryId, type, accountId, updatedAt } =
      req.body as Expense;

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const newBalance = Number(account.balance) + Number(amount);

    const updatedExpense = await prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        amount,
        description,
        categoryId,
        type,
        accountId,
        createdAt: new Date(),
        updatedAt: updatedAt || new Date(),
      },
    });

    // Update the account balance
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;

    await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getExpenses, getExpense, createExpense, updateExpense, deleteExpense };

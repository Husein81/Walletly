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
                fromAccount: {
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
        fromAccount: true,
        toAccount: true,
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
      fromAccountId,
      toAccountId,
      updatedAt,
    } = req.body as Expense;

    if (type === "TRANSFER") {
      if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
        return res.status(400).json({ message: "Invalid transfer accounts." });
      }

      const [fromAccount, toAccount] = await Promise.all([
        prisma.account.findUnique({ where: { id: fromAccountId } }),
        prisma.account.findUnique({ where: { id: toAccountId } }),
      ]);

      if (!fromAccount || !toAccount) {
        return res
          .status(404)
          .json({ message: "One or both accounts not found." });
      }

      const [newExpense] = await prisma.$transaction([
        prisma.expense.create({
          data: {
            amount,
            description: description || "",
            userId,
            type,
            fromAccountId,
            toAccountId,
            updatedAt: updatedAt || new Date(),
          },
        }),
        prisma.account.update({
          where: { id: fromAccountId },
          data: { balance: Number(fromAccount.balance) - amount },
        }),
        prisma.account.update({
          where: { id: toAccountId },
          data: { balance: Number(toAccount.balance) + amount },
        }),
      ]);

      return res.status(201).json(newExpense);
    }

    // Normal INCOME or EXPENSE
    const account = await prisma.account.findUnique({
      where: { id: fromAccountId },
    });
    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const newBalance = Number(account.balance) + Number(amount);

    const [newExpense] = await prisma.$transaction([
      prisma.expense.create({
        data: {
          amount,
          description: description || "",
          userId,
          categoryId,
          type,
          fromAccountId,
          updatedAt: updatedAt || new Date(),
        },
      }),
      prisma.account.update({
        where: { id: fromAccountId },
        data: { balance: newBalance },
      }),
    ]);

    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    const {
      amount,
      description,
      categoryId,
      type,
      fromAccountId,
      toAccountId,
      updatedAt,
    } = req.body as Expense;

    const oldExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!oldExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (type === "TRANSFER") {
      if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
        return res.status(400).json({ message: "Invalid transfer accounts." });
      }

      const [fromAccount, toAccount] = await Promise.all([
        prisma.account.findUnique({ where: { id: fromAccountId } }),
        prisma.account.findUnique({ where: { id: toAccountId } }),
      ]);

      if (!fromAccount || !toAccount) {
        return res
          .status(404)
          .json({ message: "One or both accounts not found." });
      }

      const delta = amount - oldExpense.amount;

      await prisma.$transaction([
        prisma.expense.update({
          where: { id: expenseId },
          data: {
            amount,
            description,
            categoryId,
            type,
            fromAccountId,
            toAccountId,
            updatedAt: updatedAt || new Date(),
          },
        }),
        prisma.account.update({
          where: { id: fromAccountId },
          data: { balance: { decrement: delta } },
        }),
        prisma.account.update({
          where: { id: toAccountId },
          data: { balance: { increment: delta } },
        }),
      ]);

      return res.status(200).json({ message: "Transfer updated successfully" });
    }

    // Regular EXPENSE / INCOME
    const account = await prisma.account.findUnique({
      where: { id: fromAccountId },
    });

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const balanceChange =
      type === "INCOME"
        ? amount - oldExpense.amount
        : oldExpense.amount - amount;

    const [updatedExpense] = await prisma.$transaction([
      prisma.expense.update({
        where: { id: expenseId },
        data: {
          amount,
          description,
          categoryId,
          type,
          fromAccountId,
          updatedAt: updatedAt || new Date(),
        },
      }),
      prisma.account.update({
        where: { id: fromAccountId },
        data: { balance: { increment: balanceChange } },
      }),
    ]);

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error(error);
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

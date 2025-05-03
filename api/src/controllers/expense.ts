import { Request, Response } from "express";
import prisma from "../util/prisma.js";
import { Expense } from "../types.js";

const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
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
    const { userId } = req.params;
    const { amount, description, categoryId, type, date } = req.body as Expense;

    const newExpense = await prisma.expense.create({
      data: {
        amount,
        description: description || "",
        userId,
        categoryId,
        type,
        date,
      },
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    const { amount, description, categoryId, type, date } = req.body as Expense;

    const updatedExpense = await prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        amount,
        description,
        categoryId,
        type,
        date,
      },
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

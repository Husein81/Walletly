import { Request, Response } from "express";
import prisma from "../util/prisma.js";

const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, imageUrl, type, userId } = req.body;

    const newCategory = await prisma.category.create({
      data: {
        name,
        imageUrl,
        userId,
        type,
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { name, imageUrl, type } = req.body;

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        imageUrl,
        type,
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

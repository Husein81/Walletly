import { db } from "@/db/client";
import { generateUUID } from "@/db/uuid";
import { Category } from "@/types";

export const categoryApi = {
  getCategories: async (userId: string): Promise<Category[]> => {
    return await db.getAllAsync<Category>(
      "SELECT * FROM categories WHERE userId = ? ORDER BY createdAt DESC",
      [userId],
    );
  },
  getCategory: async (categoryId: string): Promise<Category> => {
    const category = await db.getFirstAsync<Category>(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId],
    );
    if (!category) throw new Error("Category not found");
    return category;
  },
  createCategory: async (category: Omit<Category, "id">) => {
    const id = generateUUID();
    const imageUrl = category.imageUrl || "";

    await db.runAsync(
      `INSERT INTO categories (id, name, imageUrl, type, userId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, unixepoch(), unixepoch())`,
      [id, category.name, imageUrl, category.type, category.userId!],
    );

    const created = await db.getFirstAsync<Category>(
      "SELECT * FROM categories WHERE id = ?",
      [id],
    );
    if (!created) throw new Error("Failed to create category");
    return created;
  },
  updateCategory: async (category: Category) => {
    if (!category.id) throw new Error("Category ID required");

    await db.runAsync(
      `UPDATE categories 
       SET name = ?, imageUrl = ?, type = ?, updatedAt = unixepoch() 
       WHERE id = ?`,
      [category.name, category.imageUrl || "", category.type, category.id],
    );

    const updated = await db.getFirstAsync<Category>(
      "SELECT * FROM categories WHERE id = ?",
      [category.id],
    );
    if (!updated) throw new Error("Category not found after update");
    return updated;
  },
  deleteCategory: async (categoryId: string) => {
    await db.runAsync("DELETE FROM categories WHERE id = ?", [categoryId]);
  },
};

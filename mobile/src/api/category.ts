import { drizzleDb } from "@/db/client";
import { categories } from "@/db/schema";
import { generateUUID } from "@/db/uuid";
import { Category } from "@/types";
import { desc, eq } from "drizzle-orm";

export const categoryApi = {
  getCategories: async (userId: string): Promise<Category[]> => {
    return (await drizzleDb
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(desc(categories.createdAt))) as Category[];
  },
  getCategory: async (categoryId: string): Promise<Category> => {
    const [category] = await drizzleDb
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);
    if (!category) throw new Error("Category not found");
    return category as Category;
  },
  createCategory: async (category: Omit<Category, "id">) => {
    const id = generateUUID();
    const imageUrl = category.imageUrl || "";

    await drizzleDb.insert(categories).values({
      id,
      name: category.name,
      imageUrl,
      type: category.type,
      userId: category.userId!,
    });

    const [created] = await drizzleDb
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    if (!created) throw new Error("Failed to create category");
    return created as Category;
  },
  updateCategory: async (category: Category) => {
    if (!category.id) throw new Error("Category ID required");

    await drizzleDb
      .update(categories)
      .set({
        name: category.name,
        imageUrl: category.imageUrl || "",
        type: category.type,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, category.id));

    const [updated] = await drizzleDb
      .select()
      .from(categories)
      .where(eq(categories.id, category.id))
      .limit(1);
    if (!updated) throw new Error("Category not found after update");
    return updated as Category;
  },
  deleteCategory: async (categoryId: string) => {
    await drizzleDb.delete(categories).where(eq(categories.id, categoryId));
  },
};

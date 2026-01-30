import { db } from "@/components/providers";
import { categories } from "@/db/schema";
import { Category } from "@/types";
import { desc, eq } from "drizzle-orm";

export const categoryApi = {
  getCategories: async (userId: string): Promise<Category[]> => {
    return (await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(desc(categories.createdAt))) as Category[];
  },
  getCategory: async (categoryId: string): Promise<Category> => {
    const category = (await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    })) as Category;
    if (!category) throw new Error("Category not found");
    return category;
  },
  createCategory: async (category: Omit<Category, "id">) => {
    const [created] = await db
      .insert(categories)
      .values({
        ...category,
        imageUrl: category.imageUrl || "",
      })
      .returning();
    return created;
  },
  updateCategory: async (category: Category) => {
    await categoryApi.getCategory(category.id!);
    const [updated] = await db
      .update(categories)
      .set({
        name: category.name,
        imageUrl: category.imageUrl || "",
        type: category.type,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, category.id!))
      .returning();
    return updated;
  },
  deleteCategory: async (categoryId: string) => {
    await categoryApi.getCategory(categoryId); // Ensure category exists
    await db.delete(categories).where(eq(categories.id, categoryId));
  },
};

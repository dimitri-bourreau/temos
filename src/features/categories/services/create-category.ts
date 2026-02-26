import type { Category } from "@/types";
import type { TemosDB } from "@/db";

export async function createCategory(
  db: TemosDB,
  data: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<Category> {
  const now = new Date().toISOString();
  const category: Category = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await db.categories.add(category);
  return category;
}

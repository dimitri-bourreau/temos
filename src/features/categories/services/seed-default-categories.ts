import type { TemosDB } from "@/db";
import type { Category } from "@/types";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export async function seedDefaultCategories(db: TemosDB): Promise<Category[]> {
  const existing = await db.categories.count();
  if (existing > 0) return db.categories.toArray();

  const now = new Date().toISOString();
  const categories: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }));

  await db.categories.bulkAdd(categories);
  return categories;
}

import type { Category } from "@/types";
import type { TemosDB } from "@/db";

export async function updateCategory(
  db: TemosDB,
  id: string,
  updates: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>
): Promise<Category> {
  const existing = await db.categories.get(id);
  if (!existing) throw new Error(`Category ${id} not found`);

  const updated: Category = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await db.categories.put(updated);
  return updated;
}

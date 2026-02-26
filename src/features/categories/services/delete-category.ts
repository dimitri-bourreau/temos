import type { TemosDB } from "@/db";

export async function deleteCategory(db: TemosDB, id: string): Promise<void> {
  await db.categories.delete(id);
}

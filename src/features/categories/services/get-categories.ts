import type { Category } from "@/types";
import type { TemosDB } from "@/db";

export async function getCategories(db: TemosDB): Promise<Category[]> {
  return db.categories.toArray();
}

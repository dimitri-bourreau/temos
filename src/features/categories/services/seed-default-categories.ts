import type { TemosDB } from "@/db";
import type { Category } from "@/types";

export async function seedDefaultCategories(db: TemosDB): Promise<Category[]> {
  return db.categories.toArray();
}

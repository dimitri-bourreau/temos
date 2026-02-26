import type { TemosDB } from "@/db";

export async function deleteEntry(db: TemosDB, id: string): Promise<void> {
  await db.entries.delete(id);
}

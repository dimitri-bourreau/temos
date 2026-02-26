import type { TemosDB } from "@/db";

export async function deleteTask(db: TemosDB, id: string): Promise<void> {
  await db.tasks.delete(id);
}

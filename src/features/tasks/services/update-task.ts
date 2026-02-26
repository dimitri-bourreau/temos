import type { Task } from "@/types";
import type { TemosDB } from "@/db";

export async function updateTask(
  db: TemosDB,
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
): Promise<Task> {
  const existing = await db.tasks.get(id);
  if (!existing) throw new Error(`Task ${id} not found`);

  const updated: Task = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await db.tasks.put(updated);
  return updated;
}

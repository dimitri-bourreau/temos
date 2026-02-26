import type { Task } from "@/types";
import type { TemosDB } from "@/db";

export async function createTask(
  db: TemosDB,
  data: Omit<Task, "id" | "createdAt" | "updatedAt">
): Promise<Task> {
  const now = new Date().toISOString();
  const task: Task = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await db.tasks.add(task);
  return task;
}

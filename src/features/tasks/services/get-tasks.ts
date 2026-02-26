import type { Task } from "@/types";
import type { TemosDB } from "@/db";

export async function getTasks(db: TemosDB): Promise<Task[]> {
  return db.tasks.toArray();
}

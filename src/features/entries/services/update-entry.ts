import type { TimeEntry } from "@/types";
import type { TemosDB } from "@/db";

export async function updateEntry(
  db: TemosDB,
  id: string,
  updates: Partial<Omit<TimeEntry, "id" | "createdAt" | "updatedAt">>
): Promise<TimeEntry> {
  const existing = await db.entries.get(id);
  if (!existing) throw new Error(`Entry ${id} not found`);

  const updated: TimeEntry = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await db.entries.put(updated);
  return updated;
}

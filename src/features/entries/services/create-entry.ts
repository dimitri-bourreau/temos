import type { TimeEntry } from "@/types";
import type { TemosDB } from "@/db";

export async function createEntry(
  db: TemosDB,
  data: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">
): Promise<TimeEntry> {
  const now = new Date().toISOString();
  const entry: TimeEntry = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await db.entries.add(entry);
  return entry;
}

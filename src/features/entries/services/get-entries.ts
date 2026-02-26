import type { TimeEntry } from "@/types";
import type { TemosDB } from "@/db";

export async function getEntries(db: TemosDB): Promise<TimeEntry[]> {
  return db.entries.orderBy("startTime").reverse().toArray();
}

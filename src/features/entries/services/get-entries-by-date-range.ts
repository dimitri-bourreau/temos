import type { TimeEntry } from "@/types";
import type { TemosDB } from "@/db";

export async function getEntriesByDateRange(
  db: TemosDB,
  startDate: string,
  endDate: string
): Promise<TimeEntry[]> {
  return db.entries
    .where("startTime")
    .between(startDate, endDate, true, true)
    .sortBy("startTime");
}

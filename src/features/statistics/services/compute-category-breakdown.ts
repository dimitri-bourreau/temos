import { parseISO, differenceInMinutes } from "date-fns";
import type { TimeEntry, ID } from "@/types";

export function computeCategoryBreakdown(
  entries: TimeEntry[]
): { categoryId: ID; minutes: number }[] {
  const map = new Map<string, number>();

  for (const entry of entries) {
    const minutes = differenceInMinutes(
      parseISO(entry.endTime),
      parseISO(entry.startTime)
    );
    map.set(entry.categoryId, (map.get(entry.categoryId) || 0) + minutes);
  }

  return Array.from(map.entries())
    .map(([categoryId, minutes]) => ({ categoryId, minutes }))
    .sort((a, b) => b.minutes - a.minutes);
}

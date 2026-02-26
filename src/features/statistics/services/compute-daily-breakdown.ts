import { parseISO, startOfDay, format, differenceInMinutes } from "date-fns";
import type { TimeEntry } from "@/types";

export function computeDailyBreakdown(
  entries: TimeEntry[]
): { date: string; minutes: number }[] {
  const map = new Map<string, number>();

  for (const entry of entries) {
    const dateKey = format(startOfDay(parseISO(entry.startTime)), "yyyy-MM-dd");
    const minutes = differenceInMinutes(
      parseISO(entry.endTime),
      parseISO(entry.startTime)
    );
    map.set(dateKey, (map.get(dateKey) || 0) + minutes);
  }

  return Array.from(map.entries())
    .map(([date, minutes]) => ({ date, minutes }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

import { parseISO, format } from "date-fns";
import type { TimeEntry } from "@/types";

export interface DayGroup {
  dateKey: string;
  entries: TimeEntry[];
}

export function groupEntriesByDay(entries: TimeEntry[]): DayGroup[] {
  const groups = new Map<string, TimeEntry[]>();

  for (const entry of entries) {
    const dateKey = format(parseISO(entry.startTime), "yyyy-MM-dd");
    const group = groups.get(dateKey);
    if (group) {
      group.push(entry);
    } else {
      groups.set(dateKey, [entry]);
    }
  }

  return Array.from(groups, ([dateKey, entries]) => ({ dateKey, entries }));
}

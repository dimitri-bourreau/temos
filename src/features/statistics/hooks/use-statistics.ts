import { useMemo } from "react";
import { parseISO, format, differenceInMinutes } from "date-fns";
import { useEntriesStore } from "@/features/entries/store";

function minutesSinceMidnight(isoString: string): number {
  const date = parseISO(isoString);
  return date.getHours() * 60 + date.getMinutes();
}

function minutesToTimeString(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = Math.round(totalMinutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function useStatistics() {
  const entries = useEntriesStore((s) => s.entries);

  return useMemo(() => {
    if (entries.length === 0) {
      return { avgDailyMinutes: 0, avgStartTime: null, avgEndTime: null, daysCount: 0 };
    }

    const today = format(new Date(), "yyyy-MM-dd");

    // Group entries by day, excluding today (incomplete day)
    const byDay = new Map<string, typeof entries>();
    for (const entry of entries) {
      const dayKey = format(parseISO(entry.startTime), "yyyy-MM-dd");
      if (dayKey === today) continue;
      if (!byDay.has(dayKey)) byDay.set(dayKey, []);
      byDay.get(dayKey)!.push(entry);
    }

    const daysCount = byDay.size;
    if (daysCount === 0) {
      return { avgDailyMinutes: 0, avgStartTime: null, avgEndTime: null, daysCount: 0 };
    }

    let totalMinutes = 0;
    let totalStartMinutes = 0;
    let totalEndMinutes = 0;

    for (const dayEntries of byDay.values()) {
      // Sum durations for the day
      const dayMinutes = dayEntries.reduce(
        (sum, e) => sum + differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime)),
        0
      );
      totalMinutes += dayMinutes;

      // Earliest start time of the day
      const earliestStart = dayEntries.reduce(
        (min, e) => Math.min(min, minutesSinceMidnight(e.startTime)),
        Infinity
      );
      totalStartMinutes += earliestStart;

      // Latest end time of the day
      const latestEnd = dayEntries.reduce(
        (max, e) => Math.max(max, minutesSinceMidnight(e.endTime)),
        -Infinity
      );
      totalEndMinutes += latestEnd;
    }

    return {
      avgDailyMinutes: Math.round(totalMinutes / daysCount),
      avgStartTime: minutesToTimeString(Math.round(totalStartMinutes / daysCount)),
      avgEndTime: minutesToTimeString(Math.round(totalEndMinutes / daysCount)),
      daysCount,
    };
  }, [entries]);
}

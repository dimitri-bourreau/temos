import { useMemo } from "react";
import {
  parseISO,
  format,
  differenceInMinutes,
  getISOWeek,
  getISOWeekYear,
  startOfMonth,
  endOfMonth,
} from "date-fns";
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

function isoWeekKey(date: Date): string {
  return `${getISOWeekYear(date)}-W${String(getISOWeek(date)).padStart(2, "0")}`;
}

export function useStatistics() {
  const entries = useEntriesStore((s) => s.entries);

  return useMemo(() => {
    const empty = {
      avgDailyMinutes: 0,
      avgStartTime: null as string | null,
      avgEndTime: null as string | null,
      daysCount: 0,
      avgWeeklyMinutesCurrentMonth: 0,
      avgWeeklyMinutesAllTime: 0,
    };

    if (entries.length === 0) return empty;

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
    if (daysCount === 0) return empty;

    let totalMinutes = 0;
    let totalStartMinutes = 0;
    let totalEndMinutes = 0;
    const dayMinutesMap = new Map<string, number>();

    for (const [dayKey, dayEntries] of byDay.entries()) {
      const dayMinutes = dayEntries.reduce(
        (sum, e) =>
          sum + differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime)),
        0
      );
      dayMinutesMap.set(dayKey, dayMinutes);
      totalMinutes += dayMinutes;

      const earliestStart = dayEntries.reduce(
        (min, e) => Math.min(min, minutesSinceMidnight(e.startTime)),
        Infinity
      );
      totalStartMinutes += earliestStart;

      const latestEnd = dayEntries.reduce(
        (max, e) => Math.max(max, minutesSinceMidnight(e.endTime)),
        -Infinity
      );
      totalEndMinutes += latestEnd;
    }

    // Weekly averages
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const allWeeks = new Map<string, number>();
    const currentMonthWeeks = new Map<string, number>();

    for (const [dayKey, dayMinutes] of dayMinutesMap.entries()) {
      const date = parseISO(dayKey);
      const wk = isoWeekKey(date);
      allWeeks.set(wk, (allWeeks.get(wk) ?? 0) + dayMinutes);
      if (date >= monthStart && date <= monthEnd) {
        currentMonthWeeks.set(wk, (currentMonthWeeks.get(wk) ?? 0) + dayMinutes);
      }
    }

    const avgWeeklyMinutesAllTime =
      allWeeks.size > 0
        ? Math.round(
            [...allWeeks.values()].reduce((s, m) => s + m, 0) / allWeeks.size
          )
        : 0;

    const avgWeeklyMinutesCurrentMonth =
      currentMonthWeeks.size > 0
        ? Math.round(
            [...currentMonthWeeks.values()].reduce((s, m) => s + m, 0) /
              currentMonthWeeks.size
          )
        : 0;

    return {
      avgDailyMinutes: Math.round(totalMinutes / daysCount),
      avgStartTime: minutesToTimeString(Math.round(totalStartMinutes / daysCount)),
      avgEndTime: minutesToTimeString(Math.round(totalEndMinutes / daysCount)),
      daysCount,
      avgWeeklyMinutesCurrentMonth,
      avgWeeklyMinutesAllTime,
    };
  }, [entries]);
}

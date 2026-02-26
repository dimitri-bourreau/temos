"use client";

import { useMemo } from "react";
import type { TimeEntry, Period, PeriodStats, WorkSchedule } from "@/types";
import { getPeriodRange } from "@/lib/date-utils";
import { computePeriodStats } from "./services/compute-period-stats";

export function useStatistics(
  entries: TimeEntry[],
  date: Date,
  period: Period,
  schedule: WorkSchedule
): PeriodStats {
  return useMemo(() => {
    const { start, end } = getPeriodRange(date, period);

    const filtered = entries.filter((e) => {
      const entryStart = new Date(e.startTime);
      return entryStart >= start && entryStart <= end;
    });

    return computePeriodStats(filtered, start, end, schedule);
  }, [entries, date, period, schedule]);
}

import { parseISO, differenceInMinutes, getDay } from "date-fns";
import type { TimeEntry, WorkSchedule, PeriodStats } from "@/types";
import { getDaysInPeriod } from "@/lib/date-utils";
import { computeDailyBreakdown } from "./compute-daily-breakdown";
import { computeCategoryBreakdown } from "./compute-category-breakdown";
import { computeAveragePerDay } from "./compute-average-per-day";

export function computePeriodStats(
  entries: TimeEntry[],
  periodStart: Date,
  periodEnd: Date,
  schedule: WorkSchedule
): PeriodStats {
  const totalMinutes = entries.reduce((sum, e) => {
    return sum + differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime));
  }, 0);

  const allDays = getDaysInPeriod(periodStart, periodEnd);
  const workingDays = allDays.filter(
    (d) => !schedule.restDays.includes(getDay(d))
  );

  const targetMinutes = workingDays.length * schedule.targetHoursPerDay * 60;
  const differenceMinutes = totalMinutes - targetMinutes;

  const averageMinutesPerDay = computeAveragePerDay(
    totalMinutes,
    workingDays.length
  );

  const dailyBreakdown = computeDailyBreakdown(entries);
  const categoryBreakdown = computeCategoryBreakdown(entries);

  return {
    totalMinutes,
    averageMinutesPerDay,
    targetMinutes,
    differenceMinutes,
    dailyBreakdown,
    categoryBreakdown,
  };
}

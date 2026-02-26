import {
  differenceInMinutes,
  format,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  isWithinInterval,
} from "date-fns";
import type { Period } from "@/types";

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatHoursDecimal(minutes: number): string {
  return (minutes / 60).toFixed(1);
}

export function getEntryDurationMinutes(startTime: string, endTime: string): number {
  return differenceInMinutes(parseISO(endTime), parseISO(startTime));
}

export function getPeriodRange(date: Date, period: Period): { start: Date; end: Date } {
  switch (period) {
    case "day":
      return { start: startOfDay(date), end: endOfDay(date) };
    case "week":
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      };
    case "month":
      return { start: startOfMonth(date), end: endOfMonth(date) };
    case "year":
      return { start: startOfYear(date), end: endOfYear(date) };
  }
}

export function getDaysInPeriod(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return isWithinInterval(date, { start, end });
}

export function formatDate(date: Date | string, formatStr: string = "PP"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH:mm");
}

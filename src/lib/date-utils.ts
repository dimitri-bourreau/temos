import {
  differenceInMinutes,
  format,
  parseISO,
} from "date-fns";

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatDurationHMS(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatDurationHHMM(minutes: number): string {
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.round(Math.abs(minutes) % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatHoursDecimal(minutes: number): string {
  return (minutes / 60).toFixed(1);
}

export function getEntryDurationMinutes(startTime: string, endTime: string): number {
  return differenceInMinutes(parseISO(endTime), parseISO(startTime));
}


export function formatDate(date: Date | string, formatStr: string = "PP"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH:mm");
}

export function formatDayHeader(dateKey: string, locale: string): string {
  const date = parseISO(dateKey);
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const result = formatter.format(date);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

"use client";

import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  parseISO,
  differenceInMinutes,
  addDays,
} from "date-fns";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { getDateFnsLocale } from "@/lib/get-date-fns-locale";
import { useEntriesStore } from "@/features/entries/store";
import { formatDuration } from "@/lib/date-utils";
import { motion } from "framer-motion";

interface MonthViewProps {
  currentDate: Date;
}

function getDurationColor(totalMinutes: number): string {
  if (totalMinutes >= 8 * 60) return "text-red-500";
  if (totalMinutes >= 7 * 60) return "text-green-600";
  if (totalMinutes >= 6 * 60) return "text-orange-500";
  return "text-red-500";
}

export function MonthView({ currentDate }: MonthViewProps) {
  const entries = useEntriesStore((s) => s.entries);
  const dateFnsLocale = getDateFnsLocale(useLocale());

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const dayHeaders = useMemo(() => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(monday, i), "EEE", { locale: dateFnsLocale })
    );
  }, [dateFnsLocale]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="grid grid-cols-7 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {dayHeaders.map((d) => (
          <div
            key={d}
            className="bg-muted px-1 py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const dayEntries = entries.filter((e) =>
            isSameDay(parseISO(e.startTime), day)
          );
          const totalMinutes = dayEntries.reduce(
            (sum, e) =>
              sum +
              differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime)),
            0
          );

          const startTime =
            dayEntries.length > 0
              ? format(
                  dayEntries.reduce((earliest, e) =>
                    parseISO(e.startTime) < parseISO(earliest.startTime)
                      ? e
                      : earliest
                  ).startTime,
                  "HH:mm"
                )
              : null;

          const endTime =
            dayEntries.length > 0
              ? format(
                  dayEntries.reduce((latest, e) =>
                    parseISO(e.endTime) > parseISO(latest.endTime) ? e : latest
                  ).endTime,
                  "HH:mm"
                )
              : null;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "bg-card p-2 flex flex-col items-center justify-start min-h-24 gap-1",
                !isCurrentMonth && "bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium",
                  isToday && "bg-primary text-primary-foreground font-bold",
                  !isCurrentMonth && "text-muted-foreground"
                )}
              >
                {format(day, "d")}
              </div>
              {totalMinutes > 0 && (
                <>
                  <div
                    className={cn(
                      "text-sm font-semibold leading-none",
                      getDurationColor(totalMinutes)
                    )}
                  >
                    {formatDuration(totalMinutes)}
                  </div>
                  <div className="text-xs text-muted-foreground leading-none">
                    {startTime} – {endTime}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

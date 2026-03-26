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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MonthViewProps {
  currentDate: Date;
  colorize?: boolean;
}

function getDurationColor(totalMinutes: number): string {
  if (totalMinutes >= 8 * 60) return "text-red-500";
  if (totalMinutes >= 7 * 60) return "text-green-600";
  if (totalMinutes >= 6 * 60) return "text-orange-500";
  return "text-red-500";
}

export function MonthView({ currentDate, colorize = false }: MonthViewProps) {
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

  // Group days into weeks (rows of 7), and pre-compute per-day data + weekly totals
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      const weekDays = days.slice(i, i + 7).map((day) => {
        const dayEntries = entries.filter((e) =>
          isSameDay(parseISO(e.startTime), day)
        );
        const totalMinutes = dayEntries.reduce(
          (sum, e) =>
            sum + differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime)),
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
        return { day, totalMinutes, startTime, endTime };
      });

      const weekMinutes = weekDays.reduce((sum, d) => sum + d.totalMinutes, 0);
      result.push({ weekDays, weekMinutes });
    }
    return result;
  }, [days, entries]);

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="grid grid-cols-8 gap-px rounded-lg border border-border bg-border overflow-hidden">
          {/* Day headers */}
          {dayHeaders.map((d) => (
            <div
              key={d}
              className="bg-muted px-1 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {/* Weekly total header */}
          <div className="bg-muted px-1 py-2 text-center text-xs font-medium text-muted-foreground shadow-[inset_6px_0_8px_-6px_rgba(0,0,0,0.12)]">
            Σ
          </div>

          {/* Weeks */}
          {weeks.map(({ weekDays, weekMinutes }, weekIndex) => (
            <>
              {weekDays.map(({ day, totalMinutes, startTime, endTime }) => {
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isToday = isSameDay(day, new Date());

                const cell = (
                  <div
                    className={cn(
                      "bg-card p-1.5 flex flex-col items-center justify-around aspect-square overflow-hidden",
                      !isCurrentMonth && "bg-muted/50",
                      totalMinutes > 0 && "cursor-default"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black/50",
                        isToday && "bg-primary text-primary-foreground font-bold",
                        !isCurrentMonth && "text-muted-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                    {totalMinutes > 0 && (
                      <div
                        className={cn(
                          "text-sm leading-none",
                          colorize
                            ? getDurationColor(totalMinutes)
                            : "text-foreground"
                        )}
                      >
                        {formatDuration(totalMinutes)}
                      </div>
                    )}
                  </div>
                );

                if (totalMinutes === 0 || !startTime || !endTime) {
                  return <div key={day.toISOString()}>{cell}</div>;
                }

                return (
                  <Tooltip key={day.toISOString()}>
                    <TooltipTrigger asChild>{cell}</TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {startTime} – {endTime}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              {/* Weekly total cell */}
              <div
                key={`week-total-${weekIndex}`}
                className="bg-card flex items-center justify-center shadow-[inset_6px_0_8px_-6px_rgba(0,0,0,0.12)]"
              >
                {weekMinutes > 0 ? (
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatDuration(weekMinutes)}
                  </span>
                ) : null}
              </div>
            </>
          ))}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}

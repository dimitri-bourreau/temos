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
} from "date-fns";
import { cn } from "@/lib/utils";
import { useEntriesStore } from "@/features/entries/store";
import { motion } from "framer-motion";

interface MonthViewProps {
  currentDate: Date;
}

export function MonthView({ currentDate }: MonthViewProps) {
  const entries = useEntriesStore((s) => s.entries);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
            className="bg-muted px-1 py-1 text-center text-[10px] font-medium text-muted-foreground"
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
          const totalHours = Math.floor(totalMinutes / 60);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "aspect-square bg-card p-1 flex flex-col items-center justify-center",
                !isCurrentMonth && "bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  isToday && "bg-primary text-primary-foreground font-bold",
                  !isCurrentMonth && "text-muted-foreground"
                )}
              >
                {format(day, "d")}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground mt-0.5 h-3 leading-3">
                {totalHours > 0 ? `${totalHours}h` : ""}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

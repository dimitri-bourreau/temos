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
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { formatDuration } from "@/lib/date-utils";
import { motion } from "framer-motion";

interface MonthViewProps {
  currentDate: Date;
}

export function MonthView({ currentDate }: MonthViewProps) {
  const entries = useEntriesStore((s) => s.entries);
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);

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
    >
      <div className="grid grid-cols-7 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {dayHeaders.map((d) => (
          <div
            key={d}
            className="bg-muted px-2 py-2 text-center text-xs font-medium text-muted-foreground"
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

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[80px] bg-card p-1.5 md:min-h-[100px]",
                !isCurrentMonth && "bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday && "bg-primary text-primary-foreground font-bold",
                  !isCurrentMonth && "text-muted-foreground"
                )}
              >
                {format(day, "d")}
              </div>
              {dayEntries.length > 0 && (
                <div className="space-y-0.5">
                  {dayEntries.slice(0, 3).map((entry) => {
                    const cat = categories.find(
                      (c) => c.id === entry.categoryId
                    );
                    return (
                      <div
                        key={entry.id}
                        className="truncate rounded px-1 py-0.5 text-[10px] leading-tight"
                        style={{
                          backgroundColor: (cat?.color || "#ccc") + "30",
                          color: cat?.color || "#666",
                        }}
                      >
                        {(entry.taskId && tasks.find((t) => t.id === entry.taskId)?.name) || cat?.name || ""}
                      </div>
                    );
                  })}
                  {dayEntries.length > 3 && (
                    <div className="text-[10px] text-muted-foreground px-1">
                      +{dayEntries.length - 3}
                    </div>
                  )}
                  {totalMinutes > 0 && (
                    <div className="text-[10px] font-medium text-muted-foreground px-1">
                      {formatDuration(totalMinutes)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

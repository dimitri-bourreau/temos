"use client";

import { useMemo } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  format,
  parseISO,
  differenceInMinutes,
  getHours,
  getMinutes,
} from "date-fns";
import { useEntriesStore } from "@/features/entries/store";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WeekViewProps {
  currentDate: Date;
}

const START_HOUR = 6;
const END_HOUR = 22;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

export function WeekView({ currentDate }: WeekViewProps) {
  const entries = useEntriesStore((s) => s.entries);
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);

  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex overflow-x-auto rounded-lg border border-border">
        <div className="w-14 flex-shrink-0 border-r border-border">
          <div className="h-10 border-b border-border" />
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex h-12 items-start justify-end border-b border-border pr-2 text-[10px] text-muted-foreground"
            >
              {`${hour}:00`}
            </div>
          ))}
        </div>

        {days.map((day) => {
          const isToday = isSameDay(day, new Date());
          const dayEntries = entries.filter((e) =>
            isSameDay(parseISO(e.startTime), day)
          );

          return (
            <div key={day.toISOString()} className="flex-1 min-w-[100px] border-r border-border last:border-r-0">
              <div
                className={cn(
                  "flex h-10 items-center justify-center border-b border-border text-xs font-medium",
                  isToday && "bg-primary/10 text-primary"
                )}
              >
                <span>{format(day, "EEE d")}</span>
              </div>
              <div className="relative">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-12 border-b border-border"
                  />
                ))}
                {dayEntries.map((entry) => {
                  const cat = categories.find(
                    (c) => c.id === entry.categoryId
                  );
                  const start = parseISO(entry.startTime);
                  const end = parseISO(entry.endTime);
                  const startMinutes =
                    (getHours(start) - START_HOUR) * 60 + getMinutes(start);
                  const durationMinutes = differenceInMinutes(end, start);
                  const top = (startMinutes / 60) * 48;
                  const height = Math.max((durationMinutes / 60) * 48, 16);

                  if (startMinutes < 0) return null;

                  return (
                    <div
                      key={entry.id}
                      className="absolute left-0.5 right-0.5 overflow-hidden rounded px-1 py-0.5 text-[10px] leading-tight"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: (cat?.color || "#ccc") + "40",
                        borderLeft: `2px solid ${cat?.color || "#ccc"}`,
                      }}
                    >
                      <div className="font-medium truncate" style={{ color: cat?.color }}>
                        {(entry.taskId && tasks.find((t) => t.id === entry.taskId)?.name) || cat?.name || ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

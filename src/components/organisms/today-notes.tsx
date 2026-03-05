"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { useEntriesStore } from "@/features/entries/store";
import { useTasksStore } from "@/features/tasks/store";
import { useCategoriesStore } from "@/features/categories/store";
import { useDayNotesNavigation } from "@/features/entries/hooks/use-day-notes-navigation";
import { useTimer } from "@/features/timer/hook";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { getEntryDurationMinutes, formatDuration } from "@/lib/date-utils";
import { parseISO, format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Clock,
} from "lucide-react";

interface TaskNoteGroup {
  label: string;
  color: string | null;
  notes: string[];
}

export function TodayNotes() {
  const t = useTranslations("dashboard");
  const entries = useEntriesStore((s) => s.entries);
  const tasks = useTasksStore((s) => s.tasks);
  const categories = useCategoriesStore((s) => s.categories);
  const { isRunning, elapsed } = useTimer();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    selectedDate,
    dayStart,
    dayEnd,
    label,
    goToPrevious,
    goToNext,
    selectDate,
    datesWithEntries,
    dateFnsLocale,
  } = useDayNotesNavigation();

  const dayEntries = useMemo(
    () =>
      entries.filter(
        (e) => e.startTime >= dayStart && e.startTime <= dayEnd,
      ),
    [entries, dayStart, dayEnd],
  );

  const groups = useMemo(() => {
    const withNotes = dayEntries.filter(
      (e) => e.description.trim() !== "",
    );

    const map = new Map<string, TaskNoteGroup>();

    for (const entry of withNotes) {
      const task = entry.taskId
        ? tasks.find((t) => t.id === entry.taskId)
        : null;
      const category = categories.find((c) => c.id === entry.categoryId);

      const key = entry.taskId ?? entry.categoryId ?? "other";
      const label = task?.name ?? category?.name ?? "";

      if (!map.has(key)) {
        map.set(key, {
          label,
          color: category?.color ?? null,
          notes: [],
        });
      }
      map.get(key)!.notes.push(entry.description);
    }

    return Array.from(map.values());
  }, [dayEntries, tasks, categories]);

  const isToday = isSameDay(selectedDate, new Date());

  const totalMinutes = useMemo(() => {
    const completedMinutes = dayEntries.reduce(
      (sum, e) => sum + getEntryDurationMinutes(e.startTime, e.endTime),
      0,
    );
    const activeMinutes = isToday && isRunning ? Math.floor(elapsed / 60000) : 0;
    return completedMinutes + activeMinutes;
  }, [dayEntries, isToday, isRunning, elapsed]);

  const isDisabledDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return !datesWithEntries.has(dateKey);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      selectDate(date);
      setCalendarOpen(false);
    }
  };

  if (dayEntries.length === 0 && isToday) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="gap-1.5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {label}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    disabled={isDisabledDate}
                    locale={dateFnsLocale}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {t("hoursWorked")}: {formatDuration(totalMinutes)}
            </span>
          </div>
          {groups.length > 0 && (
            <div>
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="mb-1 flex items-center gap-1.5">
                    {group.color && (
                      <ColorSwatch
                        color={group.color}
                        className="h-2.5 w-2.5"
                      />
                    )}
                    <span className="text-sm font-medium">{group.label}</span>
                  </div>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {group.notes.map((note, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {groups.length === 0 && dayEntries.length > 0 && (
            <p className="text-sm text-muted-foreground italic">
              {t("noNotesForDay")}
            </p>
          )}
          {dayEntries.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              {t("noEntriesForDay")}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

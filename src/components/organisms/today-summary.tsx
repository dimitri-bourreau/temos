"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useEntriesStore } from "@/features/entries/store";
import { useCategoriesStore } from "@/features/categories/store";
import { useSettingsStore } from "@/features/settings/store";
import { useTimer } from "@/features/timer/hook";
import { formatDurationHHMM, formatDuration, formatTime } from "@/lib/date-utils";
import { startOfDay, endOfDay, startOfWeek, parseISO, differenceInMinutes } from "date-fns";
import { motion } from "framer-motion";
import { Clock, Target, TrendingUp, CalendarDays } from "lucide-react";
import { DayTimeline, type TimeSegment } from "@/components/atoms/day-timeline";

export function TodaySummary() {
  const t = useTranslations("dashboard");
  const entries = useEntriesStore((s) => s.entries);
  const categories = useCategoriesStore((s) => s.categories);
  const settings = useSettingsStore((s) => s.settings);
  const { isRunning, elapsed } = useTimer();
  const timerActiveLabel = t("timerActive");

  const { worked, target, diff, weekWorked, segments } = useMemo(() => {
    const now = new Date();
    const dayStart = startOfDay(now).toISOString();
    const dayEnd = endOfDay(now).toISOString();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();

    const todayEntries = entries.filter(
      (e) => e.startTime >= dayStart && e.startTime <= dayEnd
    );

    const completedMinutes = todayEntries.reduce(
      (sum, e) =>
        sum + differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime)),
      0
    );

    const activeMinutes = isRunning ? Math.floor(elapsed / 60000) : 0;
    const workedMinutes = completedMinutes + activeMinutes;

    const targetMinutes = settings.workSchedule.targetHoursPerDay * 60;

    const weekEntries = entries.filter((e) => e.startTime >= weekStart);
    const weekCompletedMinutes = weekEntries.reduce(
      (sum, e) =>
        sum + differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime)),
      0
    );
    const weekWorkedMinutes = weekCompletedMinutes + activeMinutes;

    const toMinutes = (iso: string) => {
      const d = parseISO(iso);
      return d.getHours() * 60 + d.getMinutes();
    };

    const categoryById = new Map(categories.map((c) => [c.id, c]));
    const DEFAULT_COLOR = "oklch(0.6 0.15 250)";

    const completedSegments: TimeSegment[] = todayEntries.map((e) => {
      const durationMin = differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime));
      const category = categoryById.get(e.categoryId);
      return {
        startMin: toMinutes(e.startTime),
        endMin: toMinutes(e.endTime),
        color: category?.color ?? DEFAULT_COLOR,
        tooltip: {
          label: category?.name ?? "—",
          start: formatTime(e.startTime),
          end: formatTime(e.endTime),
          duration: formatDuration(durationMin),
        },
      };
    });

    const activeSegment: TimeSegment[] =
      isRunning && settings.timerStartedAt
        ? [
            {
              startMin: toMinutes(settings.timerStartedAt),
              endMin: now.getHours() * 60 + now.getMinutes(),
              color:
                categoryById.get(settings.timerCategoryId ?? "")?.color ??
                DEFAULT_COLOR,
              active: true,
              tooltip: {
                label:
                  categoryById.get(settings.timerCategoryId ?? "")?.name ?? "—",
                start: formatTime(settings.timerStartedAt),
                end: timerActiveLabel,
                duration: formatDuration(Math.floor(elapsed / 60000)),
              },
            },
          ]
        : [];

    return {
      worked: workedMinutes,
      target: targetMinutes,
      diff: workedMinutes - targetMinutes,
      weekWorked: weekWorkedMinutes,
      segments: [...completedSegments, ...activeSegment],
    };
  }, [entries, categories, settings, isRunning, elapsed, timerActiveLabel]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("todaySummary")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {t("hoursWorked")}
              </div>
              <p className="text-xl font-bold">{formatDurationHHMM(worked)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                {t("hoursTarget")}
              </div>
              <p className="text-xl font-bold">{formatDurationHHMM(target)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                {diff >= 0 ? t("hoursExceeded") : t("hoursRemaining")}
              </div>
              <p
                className={`text-xl font-bold ${
                  diff >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatDurationHHMM(Math.abs(diff))}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                {t("hoursWeek")}
              </div>
              <p className="text-xl font-bold">{formatDurationHHMM(weekWorked)}</p>
            </div>
          </div>

          <DayTimeline segments={segments} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

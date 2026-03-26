"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useEntriesStore } from "@/features/entries/store";
import { useSettingsStore } from "@/features/settings/store";
import { useTimer } from "@/features/timer/hook";
import { formatDurationHHMM } from "@/lib/date-utils";
import { startOfWeek, parseISO, differenceInMinutes, format } from "date-fns";
import { motion } from "framer-motion";
import { Clock, Target, TrendingUp, CalendarDays } from "lucide-react";

export function WeekSummary() {
  const t = useTranslations("dashboard");
  const entries = useEntriesStore((s) => s.entries);
  const settings = useSettingsStore((s) => s.settings);
  const { isRunning, elapsed } = useTimer();

  const { weekWorked, weekTarget, weekDiff, daysWorked } = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();

    const weekEntries = entries.filter((e) => e.startTime >= weekStart);

    const completedMinutes = weekEntries.reduce(
      (sum, e) =>
        sum + differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime)),
      0
    );
    const activeMinutes = isRunning ? Math.floor(elapsed / 60000) : 0;
    const weekWorkedMinutes = completedMinutes + activeMinutes;

    const workDaysPerWeek = 7 - settings.workSchedule.restDays.length;
    const weekTargetMinutes =
      workDaysPerWeek * settings.workSchedule.targetHoursPerDay * 60;

    const uniqueDays = new Set(
      weekEntries.map((e) => format(parseISO(e.startTime), "yyyy-MM-dd"))
    );

    return {
      weekWorked: weekWorkedMinutes,
      weekTarget: weekTargetMinutes,
      weekDiff: weekWorkedMinutes - weekTargetMinutes,
      daysWorked: uniqueDays.size,
    };
  }, [entries, settings, isRunning, elapsed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("weekSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {t("hoursWeek")}
              </div>
              <p className="text-xl font-bold">{formatDurationHHMM(weekWorked)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                {t("weekTarget")}
              </div>
              <p className="text-xl font-bold">{formatDurationHHMM(weekTarget)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                {weekDiff >= 0 ? t("hoursExceeded") : t("hoursRemaining")}
              </div>
              <p
                className={`text-xl font-bold ${
                  weekDiff >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatDurationHHMM(Math.abs(weekDiff))}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                {t("daysWorked")}
              </div>
              <p className="text-xl font-bold">{daysWorked}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

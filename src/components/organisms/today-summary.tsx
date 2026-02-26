"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useEntriesStore } from "@/features/entries/store";
import { useSettingsStore } from "@/features/settings/store";
import { formatDuration } from "@/lib/date-utils";
import { startOfDay, endOfDay, parseISO, differenceInMinutes } from "date-fns";
import { motion } from "framer-motion";
import { Clock, Target, TrendingUp } from "lucide-react";

export function TodaySummary() {
  const t = useTranslations("dashboard");
  const entries = useEntriesStore((s) => s.entries);
  const settings = useSettingsStore((s) => s.settings);

  const { worked, target, diff } = useMemo(() => {
    const now = new Date();
    const dayStart = startOfDay(now).toISOString();
    const dayEnd = endOfDay(now).toISOString();

    const todayEntries = entries.filter(
      (e) => e.startTime >= dayStart && e.startTime <= dayEnd
    );

    const workedMinutes = todayEntries.reduce(
      (sum, e) =>
        sum + differenceInMinutes(parseISO(e.endTime), parseISO(e.startTime)),
      0
    );

    const targetMinutes = settings.workSchedule.targetHoursPerDay * 60;
    return {
      worked: workedMinutes,
      target: targetMinutes,
      diff: workedMinutes - targetMinutes,
    };
  }, [entries, settings]);

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
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {t("hoursWorked")}
              </div>
              <p className="text-xl font-bold">{formatDuration(worked)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                {t("hoursTarget")}
              </div>
              <p className="text-xl font-bold">{formatDuration(target)}</p>
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
                {formatDuration(Math.abs(diff))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

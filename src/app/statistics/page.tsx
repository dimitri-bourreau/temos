"use client";

import { useState, useCallback } from "react";
import { AppShell } from "@/components/templates/app-shell";
import { PeriodSelector } from "@/components/molecules/period-selector";
import { DateNavigation } from "@/components/molecules/date-navigation";
import { StatCard } from "@/components/atoms/stat-card";
import { HoursBarChart } from "@/components/organisms/hours-bar-chart";
import { TrendLineChart } from "@/components/organisms/trend-line-chart";
import { CategoryPieChart } from "@/components/organisms/category-pie-chart";
import { DailyAgenda } from "@/components/organisms/daily-agenda";
import { useEntriesStore } from "@/features/entries/store";
import { useSettingsStore } from "@/features/settings/store";
import { useStatistics } from "@/features/statistics/hook";
import { useTranslations } from "next-intl";
import { formatDuration, getPeriodRange } from "@/lib/date-utils";
import { addDays, addWeeks, addMonths, addYears, subDays, subWeeks, subMonths, subYears, format } from "date-fns";
import { Clock, Target, TrendingUp } from "lucide-react";
import type { Period } from "@/types";

export default function StatisticsPage() {
  const t = useTranslations("statistics");
  const [period, setPeriod] = useState<Period>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const entries = useEntriesStore((s) => s.entries);
  const settings = useSettingsStore((s) => s.settings);

  const stats = useStatistics(entries, currentDate, period, settings.workSchedule);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      const fn = direction === 1
        ? { day: addDays, week: addWeeks, month: addMonths, year: addYears }
        : { day: subDays, week: subWeeks, month: subMonths, year: subYears };
      setCurrentDate((d) => fn[period](d, 1));
    },
    [period]
  );

  const { start, end } = getPeriodRange(currentDate, period);
  const dateLabel = `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
        <DateNavigation
          label={dateLabel}
          onPrevious={() => navigate(-1)}
          onNext={() => navigate(1)}
          onToday={() => setCurrentDate(new Date())}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label={t("totalHours")}
            value={formatDuration(stats.totalMinutes)}
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            label={t("averagePerDay")}
            value={formatDuration(stats.averageMinutesPerDay)}
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard
            label={stats.differenceMinutes >= 0 ? t("exceeded") : t("remaining")}
            value={formatDuration(Math.abs(stats.differenceMinutes))}
            subtitle={`${t("vsTarget")}: ${formatDuration(stats.targetMinutes)}`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <HoursBarChart data={stats.dailyBreakdown} />
          <TrendLineChart data={stats.dailyBreakdown} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <CategoryPieChart data={stats.categoryBreakdown} />
          <DailyAgenda data={stats.dailyBreakdown} />
        </div>
      </div>
    </AppShell>
  );
}

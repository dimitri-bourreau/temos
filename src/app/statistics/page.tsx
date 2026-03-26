"use client";

import { useTranslations } from "next-intl";
import { AppShell } from "@/components/templates/app-shell";
import { MonthView } from "@/components/organisms/month-view";
import { DateNavigation } from "@/components/molecules/date-navigation";
import { StatsSummary } from "@/components/organisms/stats-summary";
import { useCalendarNavigation } from "@/features/calendar/hooks/use-calendar-navigation";
import { PeriodPieCharts } from "@/components/organisms/period-pie-charts";

export default function StatisticsPage() {
  const t = useTranslations("statistics");
  const { currentDate, label, goToPrevious, goToNext, goToToday } =
    useCalendarNavigation();

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex gap-6 items-start">
          <div className="w-1/2 space-y-3">
            <DateNavigation
              label={label}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onToday={goToToday}
            />
            <MonthView currentDate={currentDate} colorize />
          </div>
          <div className="w-1/2">
            <StatsSummary />
          </div>
        </div>
        <PeriodPieCharts />
      </div>
    </AppShell>
  );
}

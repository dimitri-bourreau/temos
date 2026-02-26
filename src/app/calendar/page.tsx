"use client";

import { useState } from "react";
import { AppShell } from "@/components/templates/app-shell";
import { MonthView } from "@/components/organisms/month-view";
import { WeekView } from "@/components/organisms/week-view";
import { DateNavigation } from "@/components/molecules/date-navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { addMonths, subMonths, addWeeks, subWeeks, format } from "date-fns";

export default function CalendarPage() {
  const t = useTranslations("calendar");
  const [view, setView] = useState<"week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevious = () => {
    setCurrentDate((d) => (view === "month" ? subMonths(d, 1) : subWeeks(d, 1)));
  };

  const handleNext = () => {
    setCurrentDate((d) => (view === "month" ? addMonths(d, 1) : addWeeks(d, 1)));
  };

  const dateLabel =
    view === "month"
      ? format(currentDate, "MMMM yyyy")
      : `Week of ${format(currentDate, "MMM d, yyyy")}`;

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Tabs value={view} onValueChange={(v) => setView(v as "week" | "month")}>
            <TabsList>
              <TabsTrigger value="week">{t("weekView")}</TabsTrigger>
              <TabsTrigger value="month">{t("monthView")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <DateNavigation
          label={dateLabel}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={() => setCurrentDate(new Date())}
        />
        {view === "month" ? (
          <MonthView currentDate={currentDate} />
        ) : (
          <WeekView currentDate={currentDate} />
        )}
      </div>
    </AppShell>
  );
}

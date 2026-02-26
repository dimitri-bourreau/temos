"use client";

import { AppShell } from "@/components/templates/app-shell";
import { TodaySummary } from "@/components/organisms/today-summary";
import { QuickTimer } from "@/components/organisms/quick-timer";
import { RecentEntries } from "@/components/organisms/recent-entries";
import { MonthView } from "@/components/organisms/month-view";
import { WeekView } from "@/components/organisms/week-view";
import { DateNavigation } from "@/components/molecules/date-navigation";
import { CategoryOverview } from "@/components/organisms/category-overview";
import { useCalendarNavigation } from "@/features/calendar/hooks/use-calendar-navigation";

export default function DashboardPage() {
  const { currentDate, label, goToPrevious, goToNext, goToToday } =
    useCalendarNavigation();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TodaySummary />
          <QuickTimer />
        </div>

        <div className="space-y-3">
          <DateNavigation
            label={label}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onToday={goToToday}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <MonthView currentDate={currentDate} />
            <WeekView currentDate={currentDate} />
          </div>
        </div>

        <CategoryOverview />
        <RecentEntries />
      </div>
    </AppShell>
  );
}

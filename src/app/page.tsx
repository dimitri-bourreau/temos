"use client";

import { format } from "date-fns";
import { AppShell } from "@/components/templates/app-shell";
import { TodaySummary } from "@/components/organisms/today-summary";
import { QuickTimer } from "@/components/organisms/quick-timer";
import { EntryList } from "@/components/organisms/entry-list";
import { TodayNotes } from "@/components/organisms/today-notes";
import { MonthView } from "@/components/organisms/month-view";
import { DateNavigation } from "@/components/molecules/date-navigation";
import { useCalendarNavigation } from "@/features/calendar/hooks/use-calendar-navigation";

export default function DashboardPage() {
  const { currentDate, label, goToPrevious, goToNext, goToToday } =
    useCalendarNavigation();

  return (
    <AppShell>
      <div className="grid h-full grid-cols-[1fr_2fr] gap-6">
        <div className="flex flex-col gap-4">
          <QuickTimer />
          <TodaySummary />
          <DateNavigation
            label={label}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onToday={goToToday}
          />
          <MonthView currentDate={currentDate} />
        </div>

        <div className="min-h-0 overflow-y-auto space-y-6">
          <TodayNotes />
          <EntryList dateFilter={format(new Date(), "yyyy-MM-dd")} />
        </div>
      </div>
    </AppShell>
  );
}

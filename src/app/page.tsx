"use client";

import { format } from "date-fns";
import { AppShell } from "@/components/templates/app-shell";
import { TodaySummary } from "@/components/organisms/today-summary";
import { WeekPieCharts } from "@/components/organisms/week-pie-charts";
import { EntryList } from "@/components/organisms/entry-list";
import { TodayNotes } from "@/components/organisms/today-notes";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid h-full grid-cols-[1fr_2fr] gap-6">
        <div className="flex flex-col gap-4">
          <TodaySummary />
          <WeekPieCharts />
        </div>

        <div className="min-h-0 overflow-y-auto space-y-6">
          <TodayNotes />
          <EntryList dateFilter={format(new Date(), "yyyy-MM-dd")} />
        </div>
      </div>
    </AppShell>
  );
}

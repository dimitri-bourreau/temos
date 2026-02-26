"use client";

import { AppShell } from "@/components/templates/app-shell";
import { TodaySummary } from "@/components/organisms/today-summary";
import { QuickTimer } from "@/components/organisms/quick-timer";
import { RecentEntries } from "@/components/organisms/recent-entries";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TodaySummary />
          <QuickTimer />
        </div>
        <RecentEntries />
      </div>
    </AppShell>
  );
}

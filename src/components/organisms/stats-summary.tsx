"use client";

import { TrendingUp, LogIn, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDuration } from "@/lib/date-utils";
import { useStatistics } from "@/features/statistics/hooks/use-statistics";

export function StatsSummary() {
  const t = useTranslations("statistics");
  const { avgDailyMinutes, avgStartTime, avgEndTime, daysCount } = useStatistics();

  if (daysCount === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t("noData")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon={<TrendingUp className="h-4 w-4" />}
        label={t("avgDailyHours")}
        value={formatDuration(avgDailyMinutes)}
        subtitle={t("daysTracked", { count: daysCount })}
      />
      <StatCard
        icon={<LogIn className="h-4 w-4" />}
        label={t("avgStartTime")}
        value={avgStartTime ?? "—"}
      />
      <StatCard
        icon={<LogOut className="h-4 w-4" />}
        label={t("avgEndTime")}
        value={avgEndTime ?? "—"}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && (
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      )}
    </div>
  );
}

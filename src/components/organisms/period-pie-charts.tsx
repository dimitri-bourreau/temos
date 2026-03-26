"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useEntriesStore } from "@/features/entries/store";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { useSettingsStore } from "@/features/settings/store";
import { useTimer } from "@/features/timer/hook";
import { formatDurationHHMM } from "@/lib/date-utils";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  parseISO,
  differenceInMinutes,
} from "date-fns";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  computePieSlices,
  PieSlice,
} from "@/features/statistics/services/compute-pie-slices";

function MiniPieChart({
  data,
  label,
  noDataMessage,
}: {
  data: PieSlice[];
  label: string;
  noDataMessage: string;
}) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="py-4 text-center text-xs text-muted-foreground">
          {noDataMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <ResponsiveContainer width="100%" height={130}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={28}
            outerRadius={48}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              const percent = Math.round((props.payload.percent ?? 0) * 100);
              return [
                `${formatDurationHHMM(value as number)} (${percent}%)`,
                name,
              ];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="space-y-0.5">
        {data.map((entry, index) => (
          <li key={index} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span
              className="min-w-0 truncate text-foreground"
              title={entry.name}
            >
              {entry.name}
            </span>
            <span className="ml-auto shrink-0 text-muted-foreground">
              {Math.round(entry.percent * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PeriodCard({
  title,
  categoryData,
  taskData,
  noDataMessage,
  byCategory,
  byTask,
  delay,
}: {
  title: string;
  categoryData: PieSlice[];
  taskData: PieSlice[];
  noDataMessage: string;
  byCategory: string;
  byTask: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <MiniPieChart
              data={categoryData}
              label={byCategory}
              noDataMessage={noDataMessage}
            />
            <MiniPieChart
              data={taskData}
              label={byTask}
              noDataMessage={noDataMessage}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PeriodPieCharts() {
  const t = useTranslations("statistics");
  const entries = useEntriesStore((s) => s.entries);
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);
  const settings = useSettingsStore((s) => s.settings);
  const { isRunning, elapsed } = useTimer();

  const { todayData, weekData, monthData } = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now).toISOString();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
    const monthStart = startOfMonth(now).toISOString();

    const todayEntries = entries.filter((e) => e.startTime >= todayStart);
    const weekEntries = entries.filter((e) => e.startTime >= weekStart);
    const monthEntries = entries.filter((e) => e.startTime >= monthStart);

    // Add active timer minutes to the running entry's category/task
    const activeMinutes = isRunning ? Math.floor(elapsed / 60000) : 0;

    function withTimer(periodEntries: typeof entries) {
      if (!isRunning || !settings.timerCategoryId || activeMinutes === 0) {
        return periodEntries;
      }
      // Build a synthetic entry representing the active timer
      const fakeEntry = {
        id: "__timer__",
        categoryId: settings.timerCategoryId,
        taskId: settings.timerTaskId ?? undefined,
        description: "",
        startTime: new Date(Date.now() - elapsed).toISOString(),
        endTime: new Date().toISOString(),
        createdAt: "",
        updatedAt: "",
      };
      return [...periodEntries, fakeEntry];
    }

    // Re-compute duration for the fake timer entry using differenceInMinutes
    // which will naturally give `activeMinutes`. No special-casing needed.
    return {
      todayData: computePieSlices(withTimer(todayEntries), categories, tasks),
      weekData: computePieSlices(withTimer(weekEntries), categories, tasks),
      monthData: computePieSlices(withTimer(monthEntries), categories, tasks),
    };
  }, [entries, categories, tasks, settings, isRunning, elapsed]);

  const noDataMessage = t("noDataForPeriod");
  const byCategory = t("byCategory");
  const byTask = t("byTask");

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">{t("timeBreakdown")}</h2>
      <div className="grid grid-cols-3 gap-4">
        <PeriodCard
          title={t("today")}
          categoryData={todayData.categoryData}
          taskData={todayData.taskData}
          noDataMessage={noDataMessage}
          byCategory={byCategory}
          byTask={byTask}
          delay={0.1}
        />
        <PeriodCard
          title={t("thisWeek")}
          categoryData={weekData.categoryData}
          taskData={weekData.taskData}
          noDataMessage={noDataMessage}
          byCategory={byCategory}
          byTask={byTask}
          delay={0.15}
        />
        <PeriodCard
          title={t("thisMonth")}
          categoryData={monthData.categoryData}
          taskData={monthData.taskData}
          noDataMessage={noDataMessage}
          byCategory={byCategory}
          byTask={byTask}
          delay={0.2}
        />
      </div>
    </div>
  );
}

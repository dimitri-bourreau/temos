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
import { startOfWeek, parseISO, differenceInMinutes } from "date-fns";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type PieSlice = { name: string; value: number; color: string; percent: number };

const DEFAULT_COLOR = "oklch(0.6 0.15 250)";

function MiniPieChart({
  data,
  label,
}: {
  data: PieSlice[];
  label: string;
}) {
  const t = useTranslations("dashboard");

  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="py-6 text-center text-xs text-muted-foreground">
          {t("noDataThisWeek")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={60}
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
              return [`${formatDurationHHMM(value as number)} (${percent}%)`, name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="space-y-1">
        {data.map((entry, index) => (
          <li key={index} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="min-w-0 truncate text-foreground" title={entry.name}>{entry.name}</span>
            <span className="ml-auto shrink-0 text-muted-foreground">
              {Math.round(entry.percent * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WeekPieCharts() {
  const t = useTranslations("dashboard");
  const entries = useEntriesStore((s) => s.entries);
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);
  const settings = useSettingsStore((s) => s.settings);
  const { isRunning, elapsed } = useTimer();

  const { categoryData, taskData } = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();

    const weekEntries = entries.filter((e) => e.startTime >= weekStart);
    const activeMinutes = isRunning ? Math.floor(elapsed / 60000) : 0;

    const categoryById = new Map(categories.map((c) => [c.id, c]));
    const taskById = new Map(tasks.map((t) => [t.id, t]));

    // — By category —
    const minutesByCategory = new Map<string, number>();
    for (const entry of weekEntries) {
      const id = entry.categoryId;
      const minutes = differenceInMinutes(
        parseISO(entry.endTime),
        parseISO(entry.startTime)
      );
      minutesByCategory.set(id, (minutesByCategory.get(id) ?? 0) + minutes);
    }
    if (isRunning && settings.timerCategoryId) {
      const id = settings.timerCategoryId;
      minutesByCategory.set(id, (minutesByCategory.get(id) ?? 0) + activeMinutes);
    }

    const rawCategorySlices = [...minutesByCategory.entries()].map(([id, minutes]) => {
      const cat = categoryById.get(id);
      return { name: cat?.name ?? "—", value: minutes, color: cat?.color ?? DEFAULT_COLOR };
    });
    const categoryTotal = rawCategorySlices.reduce((s, d) => s + d.value, 0);
    const categoryData: PieSlice[] = rawCategorySlices
      .map((d) => ({ ...d, percent: categoryTotal > 0 ? d.value / categoryTotal : 0 }))
      .sort((a, b) => b.value - a.value);

    // — By task —
    // Key: taskId or "__cat_{categoryId}" for entries without a task
    const minutesByTask = new Map<string, number>();
    for (const entry of weekEntries) {
      const key = entry.taskId ?? `__cat_${entry.categoryId}`;
      const minutes = differenceInMinutes(
        parseISO(entry.endTime),
        parseISO(entry.startTime)
      );
      minutesByTask.set(key, (minutesByTask.get(key) ?? 0) + minutes);
    }
    if (isRunning && settings.timerTaskId) {
      const key = settings.timerTaskId;
      minutesByTask.set(key, (minutesByTask.get(key) ?? 0) + activeMinutes);
    } else if (isRunning && settings.timerCategoryId) {
      const key = `__cat_${settings.timerCategoryId}`;
      minutesByTask.set(key, (minutesByTask.get(key) ?? 0) + activeMinutes);
    }

    const rawTaskSlices = [...minutesByTask.entries()].map(([key, minutes]) => {
      if (key.startsWith("__cat_")) {
        const cat = categoryById.get(key.replace("__cat_", ""));
        return { name: cat?.name ?? "—", value: minutes, color: cat?.color ?? DEFAULT_COLOR };
      }
      const task = taskById.get(key);
      const cat = task ? categoryById.get(task.categoryId) : undefined;
      return { name: task?.name ?? "—", value: minutes, color: cat?.color ?? DEFAULT_COLOR };
    });
    const taskTotal = rawTaskSlices.reduce((s, d) => s + d.value, 0);
    const taskData: PieSlice[] = rawTaskSlices
      .map((d) => ({ ...d, percent: taskTotal > 0 ? d.value / taskTotal : 0 }))
      .sort((a, b) => b.value - a.value);

    return { categoryData, taskData };
  }, [entries, categories, tasks, settings, isRunning, elapsed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("timeBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <MiniPieChart data={categoryData} label={t("byCategory")} />
            <MiniPieChart data={taskData} label={t("byTask")} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { useTimer } from "@/features/timer/hook";
import type { Task } from "@/types";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { motion } from "framer-motion";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function QuickTimer() {
  const t = useTranslations("dashboard");
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);
  const { isRunning, elapsed, start, stop } = useTimer();
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const handleStart = async () => {
    const task = tasks.find((tk) => tk.id === selectedTaskId) || tasks[0];
    if (task) {
      await start(task.categoryId, task.id);
    }
  };

  const tasksByCategory = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.categoryId]) map[task.categoryId] = [];
      map[task.categoryId].push(task);
    }
    return map;
  }, [tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("quickTimer")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div
              className={`text-center font-mono text-3xl font-bold tabular-nums ${
                isRunning ? "animate-pulse" : ""
              }`}
            >
              {formatElapsed(elapsed)}
            </div>
            <div className="flex items-center gap-2">
              {!isRunning && (
                <Select
                  value={selectedTaskId}
                  onValueChange={setSelectedTaskId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={t("selectTask")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const catTasks = tasksByCategory[cat.id];
                      if (!catTasks?.length) return null;
                      return (
                        <SelectGroup key={cat.id}>
                          <SelectLabel>
                            <div className="flex items-center gap-2">
                              <ColorSwatch
                                color={cat.color}
                                className="h-3 w-3"
                              />
                              {cat.name}
                            </div>
                          </SelectLabel>
                          {catTasks.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
              <Button
                onClick={isRunning ? stop : handleStart}
                variant={isRunning ? "destructive" : "default"}
                className={`active:scale-95 transition-transform ${isRunning ? "w-full" : ""}`}
              >
                {isRunning ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    {t("stopTimer")}
                  </>
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { useEntriesStore } from "@/features/entries/store";
import { useTranslations } from "next-intl";
import type { Task, TimeEntry } from "@/types";
import { format, parseISO } from "date-fns";

interface EntryFormProps {
  entry?: TimeEntry | null;
}

export function EntryForm({ entry }: EntryFormProps) {
  const t = useTranslations("entries");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);
  const addEntry = useEntriesStore((s) => s.add);
  const updateEntry = useEntriesStore((s) => s.update);

  const now = new Date();
  const defaultDate = format(now, "yyyy-MM-dd");
  const defaultStart = format(now, "HH:mm");
  const defaultEnd = format(
    new Date(now.getTime() + 60 * 60 * 1000),
    "HH:mm"
  );

  const [taskId, setTaskId] = useState(entry?.taskId || tasks[0]?.id || "");
  const [note, setNote] = useState(entry?.description || "");
  const [date, setDate] = useState(
    entry ? format(parseISO(entry.startTime), "yyyy-MM-dd") : defaultDate
  );
  const [startTime, setStartTime] = useState(
    entry ? format(parseISO(entry.startTime), "HH:mm") : defaultStart
  );
  const [endTime, setEndTime] = useState(
    entry ? format(parseISO(entry.endTime), "HH:mm") : defaultEnd
  );

  const tasksByCategory = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.categoryId]) map[task.categoryId] = [];
      map[task.categoryId].push(task);
    }
    return map;
  }, [tasks]);

  useEffect(() => {
    if (!taskId && tasks.length > 0) {
      setTaskId(tasks[0].id);
    }
  }, [tasks, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTask = tasks.find((t) => t.id === taskId);
    const categoryId = selectedTask?.categoryId ?? "";

    const startISO = new Date(`${date}T${startTime}`).toISOString();
    const endISO = new Date(`${date}T${endTime}`).toISOString();

    if (entry) {
      await updateEntry(entry.id, {
        categoryId,
        taskId: taskId || undefined,
        description: note,
        startTime: startISO,
        endTime: endISO,
      });
    } else {
      await addEntry({
        categoryId,
        taskId: taskId || undefined,
        description: note,
        startTime: startISO,
        endTime: endISO,
      });
    }
    router.push("/entries");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry ? t("edit") : t("new")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("task")}</Label>
            <Select value={taskId} onValueChange={setTaskId}>
              <SelectTrigger>
                <SelectValue />
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
          </div>
          <div className="space-y-2">
            <Label>{t("note")}</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("notePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("date")}</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("startTime")}</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("endTime")}</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{tCommon("save")}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/entries")}
            >
              {tCommon("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

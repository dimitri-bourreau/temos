"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { useTranslations } from "next-intl";
import type { Task } from "@/types";

interface TimerTaskPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (categoryId: string, taskId: string) => void;
}

export function TimerTaskPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: TimerTaskPickerDialogProps) {
  const t = useTranslations("timer");
  const tCommon = useTranslations("common");
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);

  const [search, setSearch] = useState("");

  const normalize = (str: string) =>
    str.normalize("NFD").replace(/\p{Mn}/gu, "").toLowerCase();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return tasks.filter((task) => normalize(task.name).includes(q));
  }, [tasks, search]);

  const tasksByCategory = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of filtered) {
      if (!map[task.categoryId]) map[task.categoryId] = [];
      map[task.categoryId].push(task);
    }
    return map;
  }, [filtered]);

  const handleSelect = (task: Task) => {
    onSelect(task.categoryId, task.id);
    onOpenChange(false);
    setSearch("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setSearch("");
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("changeTask")}</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tCommon("search")}
        />
        <div className="max-h-72 overflow-y-auto space-y-1">
          {categories.map((cat) => {
            const catTasks = tasksByCategory[cat.id];
            if (!catTasks?.length) return null;
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                  <ColorSwatch color={cat.color} className="h-2.5 w-2.5" />
                  {cat.name}
                </div>
                {catTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleSelect(task)}
                    className="w-full rounded px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    {task.name}
                  </button>
                ))}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              {tCommon("noResults")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

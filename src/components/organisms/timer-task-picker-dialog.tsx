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
import { useEntriesStore } from "@/features/entries/store";
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
  const entries = useEntriesStore((s) => s.entries);

  const [search, setSearch] = useState("");

  const normalize = (str: string) =>
    str.normalize("NFD").replace(/\p{Mn}/gu, "").toLowerCase();

  // Sort tasks by most recently used (based on entries sorted newest first).
  // Tasks never used appear at the end, ordered by creation date.
  const sortedTasks = useMemo(() => {
    const lastUsedOrder: string[] = [];
    for (const entry of entries) {
      if (entry.taskId && !lastUsedOrder.includes(entry.taskId)) {
        lastUsedOrder.push(entry.taskId);
      }
    }

    return [...tasks].sort((a, b) => {
      const ai = lastUsedOrder.indexOf(a.id);
      const bi = lastUsedOrder.indexOf(b.id);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
  }, [tasks, entries]);

  const filtered = useMemo(() => {
    const q = normalize(search);
    return sortedTasks.filter((task) => normalize(task.name).includes(q));
  }, [sortedTasks, search]);

  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

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
          {filtered.map((task) => {
            const category = categoryById[task.categoryId];
            return (
              <button
                key={task.id}
                onClick={() => handleSelect(task)}
                className="w-full rounded px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
              >
                {category && (
                  <ColorSwatch color={category.color} className="h-2.5 w-2.5 shrink-0" />
                )}
                <span className="text-muted-foreground">{category?.name}</span>
                <span className="text-muted-foreground">–</span>
                <span>{task.name}</span>
              </button>
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

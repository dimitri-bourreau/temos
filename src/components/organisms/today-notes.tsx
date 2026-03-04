"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useEntriesStore } from "@/features/entries/store";
import { useTasksStore } from "@/features/tasks/store";
import { useCategoriesStore } from "@/features/categories/store";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface TaskNoteGroup {
  label: string;
  color: string | null;
  notes: string[];
}

export function TodayNotes() {
  const t = useTranslations("dashboard");
  const entries = useEntriesStore((s) => s.entries);
  const tasks = useTasksStore((s) => s.tasks);
  const categories = useCategoriesStore((s) => s.categories);

  const groups = useMemo(() => {
    const now = new Date();
    const dayStart = startOfDay(now).toISOString();
    const dayEnd = endOfDay(now).toISOString();

    const todayEntries = entries.filter(
      (e) =>
        e.startTime >= dayStart &&
        e.startTime <= dayEnd &&
        e.description.trim() !== ""
    );

    const map = new Map<string, TaskNoteGroup>();

    for (const entry of todayEntries) {
      const task = entry.taskId
        ? tasks.find((t) => t.id === entry.taskId)
        : null;
      const category = categories.find((c) => c.id === entry.categoryId);

      const key = entry.taskId ?? entry.categoryId ?? "other";
      const label = task?.name ?? category?.name ?? "";

      if (!map.has(key)) {
        map.set(key, {
          label,
          color: category?.color ?? null,
          notes: [],
        });
      }
      map.get(key)!.notes.push(entry.description);
    }

    return Array.from(map.values());
  }, [entries, tasks, categories]);

  if (groups.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="gap-1.5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {t("todayNotes")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {groups.map((group) => (
              <div key={group.label}>
                <div className="mb-1 flex items-center gap-1.5">
                  {group.color && (
                    <ColorSwatch color={group.color} className="h-2.5 w-2.5" />
                  )}
                  <span className="text-sm font-medium">{group.label}</span>
                </div>
                <ul className="list-disc space-y-0.5 pl-5">
                  {group.notes.map((note, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

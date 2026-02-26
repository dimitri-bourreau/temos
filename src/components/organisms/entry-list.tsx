"use client";

import { useMemo, useState } from "react";
import { CategoryBadge } from "@/components/molecules/category-badge";
import { EmptyState } from "@/components/atoms/empty-state";
import { EntryEditDialog } from "@/components/organisms/entry-edit-dialog";
import { useEntriesStore } from "@/features/entries/store";
import { useTasksStore } from "@/features/tasks/store";
import { useTranslations, useLocale } from "next-intl";
import type { TimeEntry } from "@/types";
import {
  formatTime,
  formatDurationHMS,
  getEntryDurationMinutes,
  formatDayHeader,
} from "@/lib/date-utils";
import { groupEntriesByDay } from "@/features/entries/services/group-entries-by-day";
import { motion } from "framer-motion";

interface EntryListProps {
  categoryFilter?: string;
}

export function EntryList({ categoryFilter }: EntryListProps) {
  const t = useTranslations("entries");
  const locale = useLocale();
  const entries = useEntriesStore((s) => s.entries);
  const tasks = useTasksStore((s) => s.tasks);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const filtered = categoryFilter
    ? entries.filter((e) => e.categoryId === categoryFilter)
    : entries;

  const dayGroups = useMemo(() => groupEntriesByDay(filtered), [filtered]);

  if (filtered.length === 0) {
    return <EmptyState message={t("noEntries")} />;
  }

  return (
    <>
      <div className="space-y-6">
        {dayGroups.map((group) => (
          <section key={group.dateKey}>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              {formatDayHeader(group.dateKey, locale)}
            </h3>
            <div className="space-y-2">
              {group.entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.03 }}
                  className="flex cursor-pointer items-start justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  onClick={() => setEditingEntry(entry)}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span>
                        {formatTime(entry.startTime)} -{" "}
                        {formatTime(entry.endTime)}
                      </span>
                      <CategoryBadge categoryId={entry.categoryId} />
                      {entry.taskId && (
                        <span className="font-medium">
                          {tasks.find((t) => t.id === entry.taskId)?.name}
                        </span>
                      )}
                    </div>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground/70 italic">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-sm font-medium">
                    {formatDurationHMS(
                      getEntryDurationMinutes(
                        entry.startTime,
                        entry.endTime
                      )
                    )}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <EntryEditDialog
        open={editingEntry !== null}
        onOpenChange={(open) => {
          if (!open) setEditingEntry(null);
        }}
        entry={editingEntry}
      />
    </>
  );
}

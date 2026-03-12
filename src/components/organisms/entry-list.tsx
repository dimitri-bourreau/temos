"use client";

import { useState } from "react";
import { CategoryBadge } from "@/components/molecules/category-badge";
import { EmptyState } from "@/components/atoms/empty-state";
import { EntryEditDialog } from "@/components/organisms/entry-edit-dialog";
import { Button } from "@/components/ui/button";
import { useEntriesStore } from "@/features/entries/store";
import { useTasksStore } from "@/features/tasks/store";
import { usePaginatedEntries } from "@/features/entries/hooks/use-paginated-entries";
import { useTranslations, useLocale } from "next-intl";
import type { TimeEntry } from "@/types";
import {
  formatTime,
  formatDurationHMS,
  formatDuration,
  getEntryDurationMinutes,
  formatDayHeader,
} from "@/lib/date-utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EntryListProps {
  categoryFilter?: string;
  dateFilter?: string;
}

export function EntryList({ categoryFilter, dateFilter }: EntryListProps) {
  const t = useTranslations("entries");
  const locale = useLocale();
  const entries = useEntriesStore((s) => s.entries);
  const tasks = useTasksStore((s) => s.tasks);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const { filtered, paginatedDayGroups, currentPage, totalPages, goToPage } =
    usePaginatedEntries(entries, categoryFilter, dateFilter);

  if (filtered.length === 0) {
    return <EmptyState message={t(dateFilter ? "noEntriesToday" : "noEntries")} />;
  }

  return (
    <>
      <div className="space-y-6">
        {paginatedDayGroups.map((group) => {
          const totalMinutes = group.entries.reduce(
            (sum, e) => sum + getEntryDurationMinutes(e.startTime, e.endTime),
            0
          );
          return (
            <section key={group.dateKey}>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span>{formatDayHeader(group.dateKey, locale)}</span>
                <span className="font-normal">{formatDuration(totalMinutes)}</span>
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
                        getEntryDurationMinutes(entry.startTime, entry.endTime)
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("pagination.previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("pagination.pageOf", { current: currentPage, total: totalPages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {t("pagination.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

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

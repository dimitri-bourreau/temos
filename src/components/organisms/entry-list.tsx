"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { CategoryBadge } from "@/components/molecules/category-badge";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { EmptyState } from "@/components/atoms/empty-state";
import { useEntriesStore } from "@/features/entries/store";
import { useTranslations } from "next-intl";
import { formatDate, formatTime, formatDuration, getEntryDurationMinutes } from "@/lib/date-utils";
import { motion } from "framer-motion";

interface EntryListProps {
  categoryFilter?: string;
}

export function EntryList({ categoryFilter }: EntryListProps) {
  const t = useTranslations("entries");
  const tCommon = useTranslations("common");
  const entries = useEntriesStore((s) => s.entries);
  const removeEntry = useEntriesStore((s) => s.remove);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = categoryFilter
    ? entries.filter((e) => e.categoryId === categoryFilter)
    : entries;

  if (filtered.length === 0) {
    return <EmptyState message={t("noEntries")} />;
  }

  return (
    <>
      <div className="space-y-2">
        {filtered.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: i * 0.03 }}
            className="group flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {entry.description || formatDate(entry.startTime)}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {formatDate(entry.startTime)} {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                </span>
                <CategoryBadge categoryId={entry.categoryId} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {formatDuration(getEntryDurationMinutes(entry.startTime, entry.endTime))}
              </span>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link href={`/entries/${entry.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => setDeleteTarget(entry.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        title={tCommon("delete")}
        description={t("deleteConfirm")}
        onConfirm={() => {
          if (deleteTarget) removeEntry(deleteTarget);
        }}
      />
    </>
  );
}

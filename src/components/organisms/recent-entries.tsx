"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEntriesStore } from "@/features/entries/store";
import { useTasksStore } from "@/features/tasks/store";
import { CategoryBadge } from "@/components/molecules/category-badge";
import { EmptyState } from "@/components/atoms/empty-state";
import {
  formatDate,
  formatTime,
  formatDuration,
  getEntryDurationMinutes,
} from "@/lib/date-utils";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function RecentEntries() {
  const t = useTranslations("dashboard");
  const entries = useEntriesStore((s) => s.entries);
  const tasks = useTasksStore((s) => s.tasks);
  const recent = entries.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="min-h-0 flex flex-col"
    >
      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{t("recentEntries")}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/entries">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto">
          {recent.length === 0 ? (
            <EmptyState message={t("noEntriesYet")} />
          ) : (
            <div className="space-y-3">
              {recent.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/entries/${entry.id}/edit`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm hover:border-primary/30"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {(entry.taskId &&
                        tasks.find((tk) => tk.id === entry.taskId)?.name) ||
                        formatDate(entry.startTime)}
                    </p>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground/70 italic">
                        {entry.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {formatDate(entry.startTime)}{" "}
                        {formatTime(entry.startTime)} -{" "}
                        {formatTime(entry.endTime)}
                      </span>
                      <CategoryBadge categoryId={entry.categoryId} />
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {formatDuration(
                      getEntryDurationMinutes(entry.startTime, entry.endTime)
                    )}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

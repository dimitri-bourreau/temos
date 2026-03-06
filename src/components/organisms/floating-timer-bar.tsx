"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTimer } from "@/features/timer/hook";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorSwatch } from "@/components/atoms/color-swatch";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function FloatingTimerBar() {
  const t = useTranslations("timer");
  const { isRunning, elapsed, categoryId, taskId, note, setNote, stop } =
    useTimer();
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);

  const [localNote, setLocalNote] = useState(note);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync store → local only when the store value changes externally
  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const handleNoteChange = useCallback(
    (value: string) => {
      setLocalNote(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setNote(value), 300);
    },
    [setNote],
  );

  const handleStop = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    stop(localNote);
  }, [stop, localNote]);

  const category = categories.find((c) => c.id === categoryId);
  const task = tasks.find((tk) => tk.id === taskId);

  return (
    <AnimatePresence>
      {isRunning && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="shrink-0 border-t border-border bg-background/95 shadow-lg backdrop-blur-sm mb-13 md:mb-0"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Task & category info */}
            <div className="flex max-w-52 shrink-0 items-center gap-2">
              {category && (
                <ColorSwatch color={category.color} className="h-3 w-3 shrink-0" />
              )}
              <div className="flex min-w-0 flex-col text-sm leading-tight">
                {task && (
                  <span className="truncate font-medium">{task.name}</span>
                )}
                {category && (
                  <span className="truncate text-xs text-muted-foreground">
                    {category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Elapsed time */}
            <span className="shrink-0 animate-pulse font-mono text-lg font-bold tabular-nums text-primary">
              {formatElapsed(elapsed)}
            </span>

            {/* Note input */}
            <Input
              value={localNote}
              onChange={(e) => handleNoteChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStop();
              }}
              placeholder={t("notePlaceholder")}
              className="h-8 flex-1 text-sm"
            />

            {/* Stop button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleStop}
              className="shrink-0"
            >
              <Square className="mr-1.5 h-3.5 w-3.5" />
              {t("stop")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

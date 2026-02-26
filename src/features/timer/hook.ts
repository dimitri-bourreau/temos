"use client";

import { useCallback, useEffect, useState } from "react";
import { useSettingsStore } from "@/features/settings/store";
import { useEntriesStore } from "@/features/entries/store";
import { db } from "@/db";
import { startTimer } from "./services/start-timer";
import { stopTimer } from "./services/stop-timer";
import { getElapsedTime } from "./services/get-elapsed-time";

export function useTimer() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);
  const loadEntries = useEntriesStore((s) => s.load);
  const [elapsed, setElapsed] = useState(0);

  const isRunning = settings.timerStartedAt !== null;
  const categoryId = settings.timerCategoryId;

  useEffect(() => {
    if (!isRunning) {
      setElapsed(0);
      return;
    }

    const tick = () => {
      setElapsed(getElapsedTime(settings.timerStartedAt));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, settings.timerStartedAt]);

  const start = useCallback(
    async (catId: string) => {
      const startedAt = await startTimer(db, catId);
      await updateSettings({
        timerStartedAt: startedAt,
        timerCategoryId: catId,
      });
    },
    [updateSettings]
  );

  const stop = useCallback(async () => {
    const entry = await stopTimer(db);
    if (entry) {
      await updateSettings({
        timerStartedAt: null,
        timerCategoryId: null,
      });
      await loadEntries();
    }
    return entry;
  }, [updateSettings, loadEntries]);

  return { isRunning, elapsed, categoryId, start, stop };
}

import type { TimeEntry } from "@/types";
import type { TemosDB } from "@/db";
import { getSettings } from "@/features/settings/services/get-settings";
import { updateSettings } from "@/features/settings/services/update-settings";
import { createEntry } from "@/features/entries/services/create-entry";

export async function stopTimer(
  db: TemosDB,
  note?: string
): Promise<TimeEntry | null> {
  const settings = await getSettings(db);
  if (!settings.timerStartedAt || !settings.timerCategoryId) return null;

  let description = "";
  if (settings.timerTaskId) {
    const task = await db.tasks.get(settings.timerTaskId);
    if (task) description = task.name;
  }

  const resolvedNote = note ?? settings.timerNote ?? "";
  if (resolvedNote) {
    description = description ? `${description} — ${resolvedNote}` : resolvedNote;
  }

  const entry = await createEntry(db, {
    categoryId: settings.timerCategoryId,
    description,
    startTime: settings.timerStartedAt,
    endTime: new Date().toISOString(),
  });

  await updateSettings(db, {
    timerStartedAt: null,
    timerCategoryId: null,
    timerTaskId: null,
    timerNote: null,
  });

  return entry;
}

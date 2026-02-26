import type { TemosDB } from "@/db";
import { updateSettings } from "@/features/settings/services/update-settings";

export async function startTimer(
  db: TemosDB,
  categoryId: string,
  taskId?: string
): Promise<string> {
  const startedAt = new Date().toISOString();
  await updateSettings(db, {
    timerStartedAt: startedAt,
    timerCategoryId: categoryId,
    timerTaskId: taskId ?? null,
  });
  return startedAt;
}

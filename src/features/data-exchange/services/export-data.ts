import type { TemosData } from "@/types";
import type { TemosDB } from "@/db";
import { getSettings } from "@/features/settings/services/get-settings";
import { DATA_VERSION } from "../constants";

export async function exportData(db: TemosDB): Promise<TemosData> {
  const [categories, tasks, timeEntries, settings] = await Promise.all([
    db.categories.toArray(),
    db.tasks.toArray(),
    db.entries.toArray(),
    getSettings(db),
  ]);

  return {
    version: DATA_VERSION,
    exportedAt: new Date().toISOString(),
    categories,
    tasks,
    timeEntries,
    settings,
  };
}

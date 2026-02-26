import type { TemosData } from "@/types";
import type { TemosDB } from "@/db";
import { validateImport } from "./validate-import";

export async function importData(db: TemosDB, data: unknown): Promise<boolean> {
  if (!validateImport(data)) return false;

  await db.transaction("rw", [db.entries, db.categories, db.tasks, db.settings], async () => {
    await db.entries.clear();
    await db.categories.clear();
    await db.tasks.clear();
    await db.settings.clear();

    await db.categories.bulkAdd(data.categories);
    if (data.tasks) await db.tasks.bulkAdd(data.tasks);
    await db.entries.bulkAdd(data.timeEntries);
    await db.settings.add(data.settings);
  });

  return true;
}

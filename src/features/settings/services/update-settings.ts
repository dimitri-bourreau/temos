import type { UserSettings } from "@/types";
import type { TemosDB } from "@/db";
import { getSettings } from "./get-settings";

export async function updateSettings(
  db: TemosDB,
  updates: Partial<Omit<UserSettings, "id">>
): Promise<UserSettings> {
  const current = await getSettings(db);
  const updated: UserSettings = { ...current, ...updates };
  await db.settings.put(updated);
  return updated;
}

import type { UserSettings } from "@/types";
import type { TemosDB } from "@/db";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export async function getSettings(db: TemosDB): Promise<UserSettings> {
  const settings = await db.settings.get("default");
  if (settings) return settings;

  await db.settings.add(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

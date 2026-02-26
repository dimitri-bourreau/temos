import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { getSettings } from "./get-settings";
import { DEFAULT_SETTINGS } from "@/lib/constants";

describe("getSettings", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.settings.clear();
  });

  it("returns default settings when none exist", async () => {
    const settings = await getSettings(db);
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it("returns existing settings", async () => {
    const custom = { ...DEFAULT_SETTINGS, locale: "fr" as const };
    await db.settings.add(custom);

    const settings = await getSettings(db);
    expect(settings.locale).toBe("fr");
  });
});

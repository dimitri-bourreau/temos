import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { updateSettings } from "./update-settings";
import { getSettings } from "./get-settings";

describe("updateSettings", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.settings.clear();
  });

  it("updates settings fields", async () => {
    const updated = await updateSettings(db, { locale: "fr" });
    expect(updated.locale).toBe("fr");
    expect(updated.id).toBe("default");

    const stored = await getSettings(db);
    expect(stored.locale).toBe("fr");
  });

  it("preserves unmodified fields", async () => {
    await updateSettings(db, { locale: "fr" });
    const settings = await getSettings(db);
    expect(settings.workSchedule.targetHoursPerDay).toBe(8);
  });
});

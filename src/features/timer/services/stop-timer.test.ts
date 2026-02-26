import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { startTimer } from "./start-timer";
import { stopTimer } from "./stop-timer";
import { getSettings } from "@/features/settings/services/get-settings";

describe("stopTimer", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.settings.clear();
    await db.entries.clear();
  });

  it("creates entry and clears timer state", async () => {
    await startTimer(db, "cat-1");
    const entry = await stopTimer(db);

    expect(entry).not.toBeNull();
    expect(entry!.categoryId).toBe("cat-1");

    const settings = await getSettings(db);
    expect(settings.timerStartedAt).toBeNull();
    expect(settings.timerCategoryId).toBeNull();
  });

  it("returns null when no timer is running", async () => {
    const entry = await stopTimer(db);
    expect(entry).toBeNull();
  });
});

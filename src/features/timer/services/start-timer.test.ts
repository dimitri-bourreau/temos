import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { startTimer } from "./start-timer";
import { getSettings } from "@/features/settings/services/get-settings";

describe("startTimer", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.settings.clear();
  });

  it("saves timer start time and category", async () => {
    const startedAt = await startTimer(db, "cat-1");
    expect(startedAt).toBeDefined();

    const settings = await getSettings(db);
    expect(settings.timerStartedAt).toBe(startedAt);
    expect(settings.timerCategoryId).toBe("cat-1");
  });
});

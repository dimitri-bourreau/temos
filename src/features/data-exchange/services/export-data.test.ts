import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { exportData } from "./export-data";
import { createEntry } from "@/features/entries/services/create-entry";

describe("exportData", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.entries.clear();
    await db.categories.clear();
    await db.settings.clear();
  });

  it("exports all data", async () => {
    await createEntry(db, {
      categoryId: "cat-1",
      description: "Test",
      startTime: "2024-01-15T09:00:00.000Z",
      endTime: "2024-01-15T11:00:00.000Z",
    });

    const data = await exportData(db);
    expect(data.version).toBe(1);
    expect(data.timeEntries).toHaveLength(1);
    expect(data.settings.id).toBe("default");
  });
});

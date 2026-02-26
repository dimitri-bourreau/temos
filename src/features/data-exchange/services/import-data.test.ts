import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { importData } from "./import-data";
import { DEFAULT_SETTINGS } from "@/lib/constants";

describe("importData", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.entries.clear();
    await db.categories.clear();
    await db.settings.clear();
  });

  it("imports valid data", async () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      categories: [
        { id: "cat-1", name: "Dev", color: "#aaa", icon: "code", createdAt: "", updatedAt: "" },
      ],
      timeEntries: [
        {
          id: "e-1",
          categoryId: "cat-1",
          description: "Test",
          startTime: "2024-01-15T09:00:00.000Z",
          endTime: "2024-01-15T11:00:00.000Z",
          createdAt: "",
          updatedAt: "",
        },
      ],
      settings: DEFAULT_SETTINGS,
    };

    const result = await importData(db, data);
    expect(result).toBe(true);

    const entries = await db.entries.toArray();
    expect(entries).toHaveLength(1);
  });

  it("rejects invalid data", async () => {
    const result = await importData(db, { invalid: true });
    expect(result).toBe(false);
  });
});

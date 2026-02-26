import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createEntry } from "./create-entry";
import { getEntriesByDateRange } from "./get-entries-by-date-range";

describe("getEntriesByDateRange", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.entries.clear();
  });

  it("returns entries within the date range", async () => {
    await createEntry(db, {
      categoryId: "cat-1",
      description: "In range",
      startTime: "2024-01-15T09:00:00.000Z",
      endTime: "2024-01-15T11:00:00.000Z",
    });
    await createEntry(db, {
      categoryId: "cat-1",
      description: "Out of range",
      startTime: "2024-01-20T09:00:00.000Z",
      endTime: "2024-01-20T11:00:00.000Z",
    });

    const entries = await getEntriesByDateRange(
      db,
      "2024-01-14T00:00:00.000Z",
      "2024-01-16T00:00:00.000Z"
    );

    expect(entries).toHaveLength(1);
    expect(entries[0].description).toBe("In range");
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createEntry } from "./create-entry";
import { getEntries } from "./get-entries";

describe("getEntries", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.entries.clear();
  });

  it("returns entries sorted by startTime descending", async () => {
    await createEntry(db, {
      categoryId: "cat-1",
      description: "First",
      startTime: "2024-01-15T09:00:00.000Z",
      endTime: "2024-01-15T11:00:00.000Z",
    });
    await createEntry(db, {
      categoryId: "cat-1",
      description: "Second",
      startTime: "2024-01-16T09:00:00.000Z",
      endTime: "2024-01-16T11:00:00.000Z",
    });

    const entries = await getEntries(db);
    expect(entries).toHaveLength(2);
    expect(entries[0].description).toBe("Second");
    expect(entries[1].description).toBe("First");
  });

  it("returns empty array when no entries", async () => {
    const entries = await getEntries(db);
    expect(entries).toEqual([]);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createEntry } from "./create-entry";

describe("createEntry", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.entries.clear();
  });

  it("creates an entry with generated id and timestamps", async () => {
    const entry = await createEntry(db, {
      categoryId: "cat-1",
      description: "Working on feature",
      startTime: "2024-01-15T09:00:00.000Z",
      endTime: "2024-01-15T11:00:00.000Z",
    });

    expect(entry.id).toBeDefined();
    expect(entry.categoryId).toBe("cat-1");
    expect(entry.description).toBe("Working on feature");
    expect(entry.createdAt).toBeDefined();
    expect(entry.updatedAt).toBeDefined();

    const stored = await db.entries.get(entry.id);
    expect(stored).toEqual(entry);
  });
});

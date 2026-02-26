import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createEntry } from "./create-entry";
import { deleteEntry } from "./delete-entry";

describe("deleteEntry", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.entries.clear();
  });

  it("deletes an entry by id", async () => {
    const entry = await createEntry(db, {
      categoryId: "cat-1",
      description: "To delete",
      startTime: "2024-01-15T09:00:00.000Z",
      endTime: "2024-01-15T11:00:00.000Z",
    });

    await deleteEntry(db, entry.id);
    const stored = await db.entries.get(entry.id);
    expect(stored).toBeUndefined();
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createEntry } from "./create-entry";
import { updateEntry } from "./update-entry";

describe("updateEntry", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.entries.clear();
  });

  it("updates entry fields and updatedAt", async () => {
    const entry = await createEntry(db, {
      categoryId: "cat-1",
      description: "Original",
      startTime: "2024-01-15T09:00:00.000Z",
      endTime: "2024-01-15T11:00:00.000Z",
    });

    const updated = await updateEntry(db, entry.id, {
      description: "Updated",
    });

    expect(updated.description).toBe("Updated");
    expect(updated.categoryId).toBe("cat-1");
    expect(updated.updatedAt).not.toBe(entry.updatedAt);
  });

  it("throws if entry not found", async () => {
    await expect(updateEntry(db, "nonexistent", { description: "test" })).rejects.toThrow(
      "Entry nonexistent not found"
    );
  });
});

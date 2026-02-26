import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createCategory } from "./create-category";
import { updateCategory } from "./update-category";

describe("updateCategory", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.categories.clear();
  });

  it("updates category fields", async () => {
    const cat = await createCategory(db, {
      name: "Original",
      color: "#7EC8E3",
      icon: "code",
    });

    const updated = await updateCategory(db, cat.id, { name: "Updated" });
    expect(updated.name).toBe("Updated");
    expect(updated.color).toBe("#7EC8E3");
  });

  it("throws if category not found", async () => {
    await expect(updateCategory(db, "nonexistent", { name: "test" })).rejects.toThrow();
  });
});

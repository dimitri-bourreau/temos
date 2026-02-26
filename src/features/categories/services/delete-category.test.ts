import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createCategory } from "./create-category";
import { deleteCategory } from "./delete-category";

describe("deleteCategory", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.categories.clear();
  });

  it("deletes a category by id", async () => {
    const cat = await createCategory(db, {
      name: "To delete",
      color: "#7EC8E3",
      icon: "code",
    });

    await deleteCategory(db, cat.id);
    const stored = await db.categories.get(cat.id);
    expect(stored).toBeUndefined();
  });
});

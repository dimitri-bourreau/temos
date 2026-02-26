import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createCategory } from "./create-category";

describe("createCategory", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.categories.clear();
  });

  it("creates a category with generated id and timestamps", async () => {
    const category = await createCategory(db, {
      name: "Development",
      color: "#7EC8E3",
      icon: "code",
    });

    expect(category.id).toBeDefined();
    expect(category.name).toBe("Development");
    expect(category.color).toBe("#7EC8E3");
    expect(category.createdAt).toBeDefined();

    const stored = await db.categories.get(category.id);
    expect(stored).toEqual(category);
  });
});

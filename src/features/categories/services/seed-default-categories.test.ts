import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { seedDefaultCategories } from "./seed-default-categories";

describe("seedDefaultCategories", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.categories.clear();
  });

  it("returns empty array when db is empty", async () => {
    const categories = await seedDefaultCategories(db);
    expect(categories).toHaveLength(0);
  });

  it("returns existing categories", async () => {
    const now = new Date().toISOString();
    await db.categories.add({
      id: "test-id",
      name: "Test",
      color: "#000",
      icon: "code",
      createdAt: now,
      updatedAt: now,
    });

    const categories = await seedDefaultCategories(db);
    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe("Test");
  });
});

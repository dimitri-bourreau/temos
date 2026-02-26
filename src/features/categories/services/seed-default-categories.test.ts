import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { seedDefaultCategories } from "./seed-default-categories";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

describe("seedDefaultCategories", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.categories.clear();
  });

  it("seeds default categories when db is empty", async () => {
    const categories = await seedDefaultCategories(db);
    expect(categories).toHaveLength(DEFAULT_CATEGORIES.length);
    expect(categories[0].name).toBe(DEFAULT_CATEGORIES[0].name);
  });

  it("does not seed if categories already exist", async () => {
    await seedDefaultCategories(db);
    const firstCount = await db.categories.count();

    await seedDefaultCategories(db);
    const secondCount = await db.categories.count();

    expect(secondCount).toBe(firstCount);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createCategory } from "./create-category";
import { getCategories } from "./get-categories";

describe("getCategories", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.categories.clear();
  });

  it("returns all categories", async () => {
    await createCategory(db, { name: "A", color: "#aaa", icon: "code" });
    await createCategory(db, { name: "B", color: "#bbb", icon: "users" });

    const categories = await getCategories(db);
    expect(categories).toHaveLength(2);
  });

  it("returns empty array when no categories", async () => {
    const categories = await getCategories(db);
    expect(categories).toEqual([]);
  });
});

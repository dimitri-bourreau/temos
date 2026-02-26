import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createTask } from "./create-task";
import { getTasks } from "./get-tasks";

describe("getTasks", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.tasks.clear();
  });

  it("returns all tasks", async () => {
    await createTask(db, { categoryId: "cat-1", name: "Task A" });
    await createTask(db, { categoryId: "cat-2", name: "Task B" });

    const tasks = await getTasks(db);
    expect(tasks).toHaveLength(2);
  });

  it("returns empty array when no tasks", async () => {
    const tasks = await getTasks(db);
    expect(tasks).toEqual([]);
  });
});

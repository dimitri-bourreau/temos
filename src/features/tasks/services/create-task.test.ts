import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createTask } from "./create-task";

describe("createTask", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.tasks.clear();
  });

  it("creates a task with generated id and timestamps", async () => {
    const task = await createTask(db, {
      categoryId: "cat-1",
      name: "Write tests",
    });

    expect(task.id).toBeDefined();
    expect(task.name).toBe("Write tests");
    expect(task.categoryId).toBe("cat-1");
    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();

    const stored = await db.tasks.get(task.id);
    expect(stored).toEqual(task);
  });
});

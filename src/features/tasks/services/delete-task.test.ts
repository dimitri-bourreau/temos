import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createTask } from "./create-task";
import { deleteTask } from "./delete-task";

describe("deleteTask", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.tasks.clear();
  });

  it("deletes the task from the database", async () => {
    const task = await createTask(db, {
      categoryId: "cat-1",
      name: "To delete",
    });

    await deleteTask(db, task.id);

    const stored = await db.tasks.get(task.id);
    expect(stored).toBeUndefined();
  });
});

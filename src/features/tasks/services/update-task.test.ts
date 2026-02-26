import { describe, it, expect, beforeEach } from "vitest";
import { TemosDB } from "@/db";
import { createTask } from "./create-task";
import { updateTask } from "./update-task";

describe("updateTask", () => {
  let db: TemosDB;

  beforeEach(async () => {
    db = new TemosDB();
    await db.tasks.clear();
  });

  it("updates the task name and updatedAt", async () => {
    const task = await createTask(db, {
      categoryId: "cat-1",
      name: "Old name",
    });

    const updated = await updateTask(db, task.id, { name: "New name" });

    expect(updated.name).toBe("New name");
    expect(updated.categoryId).toBe("cat-1");
    expect(updated.updatedAt).not.toBe(task.updatedAt);

    const stored = await db.tasks.get(task.id);
    expect(stored).toEqual(updated);
  });

  it("throws if task not found", async () => {
    await expect(updateTask(db, "nonexistent", { name: "x" })).rejects.toThrow(
      "Task nonexistent not found"
    );
  });
});

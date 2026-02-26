import Dexie, { type EntityTable } from "dexie";
import type { Category, Task, TimeEntry, UserSettings } from "@/types";

export class TemosDB extends Dexie {
  entries!: EntityTable<TimeEntry, "id">;
  categories!: EntityTable<Category, "id">;
  tasks!: EntityTable<Task, "id">;
  settings!: EntityTable<UserSettings, "id">;

  constructor() {
    super("temos");
    this.version(1).stores({
      entries: "id, categoryId, startTime, endTime",
      categories: "id",
      settings: "id",
    });
    this.version(2).stores({
      entries: "id, categoryId, startTime, endTime",
      categories: "id",
      tasks: "id, categoryId",
      settings: "id",
    });
    this.version(3).stores({
      entries: "id, categoryId, startTime, endTime",
      categories: "id",
      tasks: "id, categoryId",
      settings: "id",
    });
  }
}

export const db = new TemosDB();

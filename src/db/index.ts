import Dexie, { type EntityTable } from "dexie";
import type { Category, TimeEntry, UserSettings } from "@/types";

export class TemosDB extends Dexie {
  entries!: EntityTable<TimeEntry, "id">;
  categories!: EntityTable<Category, "id">;
  settings!: EntityTable<UserSettings, "id">;

  constructor() {
    super("temos");
    this.version(1).stores({
      entries: "id, categoryId, startTime, endTime",
      categories: "id",
      settings: "id",
    });
  }
}

export const db = new TemosDB();

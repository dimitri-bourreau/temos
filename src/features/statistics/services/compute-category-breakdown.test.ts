import { describe, it, expect } from "vitest";
import { computeCategoryBreakdown } from "./compute-category-breakdown";
import type { TimeEntry } from "@/types";

const makeEntry = (categoryId: string, start: string, end: string): TimeEntry => ({
  id: crypto.randomUUID(),
  categoryId,
  description: "",
  startTime: start,
  endTime: end,
  createdAt: "",
  updatedAt: "",
});

describe("computeCategoryBreakdown", () => {
  it("groups minutes by category, sorted by most time", () => {
    const entries = [
      makeEntry("dev", "2024-01-15T09:00:00.000Z", "2024-01-15T12:00:00.000Z"),
      makeEntry("meeting", "2024-01-15T13:00:00.000Z", "2024-01-15T14:00:00.000Z"),
      makeEntry("dev", "2024-01-15T14:00:00.000Z", "2024-01-15T16:00:00.000Z"),
    ];

    const result = computeCategoryBreakdown(entries);
    expect(result).toEqual([
      { categoryId: "dev", minutes: 300 },
      { categoryId: "meeting", minutes: 60 },
    ]);
  });
});

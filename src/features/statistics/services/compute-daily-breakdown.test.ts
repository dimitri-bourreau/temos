import { describe, it, expect } from "vitest";
import { computeDailyBreakdown } from "./compute-daily-breakdown";
import type { TimeEntry } from "@/types";

const makeEntry = (start: string, end: string): TimeEntry => ({
  id: "1",
  categoryId: "cat-1",
  description: "",
  startTime: start,
  endTime: end,
  createdAt: "",
  updatedAt: "",
});

describe("computeDailyBreakdown", () => {
  it("groups hours by day", () => {
    const entries = [
      makeEntry("2024-01-15T09:00:00.000Z", "2024-01-15T11:00:00.000Z"),
      makeEntry("2024-01-15T14:00:00.000Z", "2024-01-15T16:00:00.000Z"),
      makeEntry("2024-01-16T09:00:00.000Z", "2024-01-16T12:00:00.000Z"),
    ];

    const result = computeDailyBreakdown(entries);
    expect(result).toEqual([
      { date: "2024-01-15", minutes: 240 },
      { date: "2024-01-16", minutes: 180 },
    ]);
  });

  it("returns empty array for no entries", () => {
    expect(computeDailyBreakdown([])).toEqual([]);
  });
});

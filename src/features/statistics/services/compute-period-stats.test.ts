import { describe, it, expect } from "vitest";
import { computePeriodStats } from "./compute-period-stats";
import type { TimeEntry, WorkSchedule } from "@/types";

const makeEntry = (start: string, end: string, categoryId = "cat-1"): TimeEntry => ({
  id: crypto.randomUUID(),
  categoryId,
  description: "",
  startTime: start,
  endTime: end,
  createdAt: "",
  updatedAt: "",
});

const schedule: WorkSchedule = {
  targetHoursPerDay: 8,
  restDays: [0, 6],
};

describe("computePeriodStats", () => {
  it("computes stats for a week", () => {
    const entries = [
      makeEntry("2024-01-15T09:00:00.000Z", "2024-01-15T17:00:00.000Z"),
      makeEntry("2024-01-16T09:00:00.000Z", "2024-01-16T17:00:00.000Z"),
    ];

    const stats = computePeriodStats(
      entries,
      new Date("2024-01-15"),
      new Date("2024-01-21"),
      schedule
    );

    expect(stats.totalMinutes).toBe(960);
    expect(stats.targetMinutes).toBe(5 * 8 * 60);
    expect(stats.differenceMinutes).toBe(960 - 2400);
    expect(stats.dailyBreakdown).toHaveLength(2);
  });

  it("returns zero stats for no entries", () => {
    const stats = computePeriodStats(
      [],
      new Date("2024-01-15"),
      new Date("2024-01-21"),
      schedule
    );

    expect(stats.totalMinutes).toBe(0);
    expect(stats.averageMinutesPerDay).toBe(0);
  });
});

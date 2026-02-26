import { describe, it, expect } from "vitest";
import { computeAveragePerDay } from "./compute-average-per-day";

describe("computeAveragePerDay", () => {
  it("computes average", () => {
    expect(computeAveragePerDay(480, 2)).toBe(240);
  });

  it("returns 0 for 0 working days", () => {
    expect(computeAveragePerDay(480, 0)).toBe(0);
  });
});

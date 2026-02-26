import { describe, it, expect, vi } from "vitest";
import { getElapsedTime } from "./get-elapsed-time";

describe("getElapsedTime", () => {
  it("returns 0 when no timer started", () => {
    expect(getElapsedTime(null)).toBe(0);
  });

  it("returns elapsed milliseconds", () => {
    const now = Date.now();
    vi.setSystemTime(now);
    const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();

    const elapsed = getElapsedTime(fiveMinutesAgo);
    expect(elapsed).toBeGreaterThanOrEqual(5 * 60 * 1000 - 100);
    expect(elapsed).toBeLessThanOrEqual(5 * 60 * 1000 + 100);

    vi.useRealTimers();
  });
});

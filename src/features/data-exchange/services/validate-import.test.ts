import { describe, it, expect } from "vitest";
import { validateImport } from "./validate-import";

describe("validateImport", () => {
  it("accepts valid data", () => {
    const data = {
      version: 1,
      exportedAt: "2024-01-15T00:00:00.000Z",
      categories: [],
      timeEntries: [],
      settings: { id: "default" },
    };
    expect(validateImport(data)).toBe(true);
  });

  it("rejects null", () => {
    expect(validateImport(null)).toBe(false);
  });

  it("rejects wrong version", () => {
    expect(validateImport({ version: 2, categories: [], timeEntries: [], settings: {} })).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(validateImport({ version: 1 })).toBe(false);
  });
});

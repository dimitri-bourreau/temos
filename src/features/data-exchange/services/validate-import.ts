import type { TemosData } from "@/types";
import { DATA_VERSION } from "../constants";

export function validateImport(data: unknown): data is TemosData {
  if (typeof data !== "object" || data === null) return false;

  const d = data as Record<string, unknown>;
  if (d.version !== DATA_VERSION) return false;
  if (!Array.isArray(d.categories)) return false;
  if (!Array.isArray(d.timeEntries)) return false;
  if (typeof d.settings !== "object" || d.settings === null) return false;

  return true;
}

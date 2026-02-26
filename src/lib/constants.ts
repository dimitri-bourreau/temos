import type { Category, UserSettings } from "@/types";

export const DEFAULT_CATEGORIES: Omit<Category, "id" | "createdAt" | "updatedAt">[] = [];

export const DEFAULT_SETTINGS: UserSettings = {
  id: "default",
  workSchedule: {
    targetHoursPerDay: 8,
    restDays: [0, 6],
  },
  theme: "system",
  locale: "system",
  timerStartedAt: null,
  timerCategoryId: null,
  timerTaskId: null,
  timerNote: null,
};

export const PASTEL_COLORS = [
  "#7EC8E3",
  "#C3A6E0",
  "#F7C59F",
  "#A8D8A8",
  "#F4A6B0",
  "#FFD99A",
  "#A6D4F2",
  "#D4A6E8",
  "#B8E6C8",
  "#F2C6A6",
  "#A6C8F4",
  "#E8A6D4",
];

export const CATEGORY_ICONS = [
  "code",
  "users",
  "palette",
  "book-open",
  "briefcase",
  "coffee",
  "phone",
  "mail",
  "pen-tool",
  "file-text",
  "monitor",
  "globe",
  "headphones",
  "camera",
  "heart",
  "star",
  "zap",
  "target",
  "flag",
  "folder",
];

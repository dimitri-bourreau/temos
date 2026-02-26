export type ID = string;

export interface Category {
  id: ID;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: ID;
  categoryId: ID;
  description: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkSchedule {
  targetHoursPerDay: number;
  restDays: number[];
}

export interface UserSettings {
  id: "default";
  workSchedule: WorkSchedule;
  theme: "light" | "dark" | "system";
  locale: "en" | "fr" | "system";
  timerStartedAt: string | null;
  timerCategoryId: ID | null;
}

export interface TemosData {
  version: 1;
  exportedAt: string;
  categories: Category[];
  timeEntries: TimeEntry[];
  settings: UserSettings;
}

export interface PeriodStats {
  totalMinutes: number;
  averageMinutesPerDay: number;
  targetMinutes: number;
  differenceMinutes: number;
  dailyBreakdown: { date: string; minutes: number }[];
  categoryBreakdown: { categoryId: ID; minutes: number }[];
}

export type Period = "day" | "week" | "month" | "year";

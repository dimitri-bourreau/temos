import { TimeEntry, Category, Task } from "@/types";
import { parseISO, differenceInMinutes } from "date-fns";

export type PieSlice = {
  name: string;
  value: number;
  color: string;
  percent: number;
};

const DEFAULT_COLOR = "oklch(0.6 0.15 250)";

export function computePieSlices(
  entries: TimeEntry[],
  categories: Category[],
  tasks: Task[]
): { categoryData: PieSlice[]; taskData: PieSlice[] } {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const taskById = new Map(tasks.map((t) => [t.id, t]));

  // — By category —
  const minutesByCategory = new Map<string, number>();
  for (const entry of entries) {
    const minutes = differenceInMinutes(
      parseISO(entry.endTime),
      parseISO(entry.startTime)
    );
    minutesByCategory.set(
      entry.categoryId,
      (minutesByCategory.get(entry.categoryId) ?? 0) + minutes
    );
  }

  const rawCategorySlices = [...minutesByCategory.entries()].map(
    ([id, minutes]) => {
      const cat = categoryById.get(id);
      return {
        name: cat?.name ?? "—",
        value: minutes,
        color: cat?.color ?? DEFAULT_COLOR,
      };
    }
  );
  const categoryTotal = rawCategorySlices.reduce((s, d) => s + d.value, 0);
  const categoryData: PieSlice[] = rawCategorySlices
    .map((d) => ({
      ...d,
      percent: categoryTotal > 0 ? d.value / categoryTotal : 0,
    }))
    .sort((a, b) => b.value - a.value);

  // — By task —
  // Key: taskId, or "__cat_{categoryId}" for entries without a task
  const minutesByTask = new Map<string, number>();
  for (const entry of entries) {
    const key = entry.taskId ?? `__cat_${entry.categoryId}`;
    const minutes = differenceInMinutes(
      parseISO(entry.endTime),
      parseISO(entry.startTime)
    );
    minutesByTask.set(key, (minutesByTask.get(key) ?? 0) + minutes);
  }

  const rawTaskSlices = [...minutesByTask.entries()].map(([key, minutes]) => {
    if (key.startsWith("__cat_")) {
      const cat = categoryById.get(key.replace("__cat_", ""));
      return {
        name: cat?.name ?? "—",
        value: minutes,
        color: cat?.color ?? DEFAULT_COLOR,
      };
    }
    const task = taskById.get(key);
    const cat = task ? categoryById.get(task.categoryId) : undefined;
    return {
      name: task?.name ?? "—",
      value: minutes,
      color: cat?.color ?? DEFAULT_COLOR,
    };
  });
  const taskTotal = rawTaskSlices.reduce((s, d) => s + d.value, 0);
  const taskData: PieSlice[] = rawTaskSlices
    .map((d) => ({
      ...d,
      percent: taskTotal > 0 ? d.value / taskTotal : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return { categoryData, taskData };
}

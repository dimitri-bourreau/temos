export function computeAveragePerDay(
  totalMinutes: number,
  workingDays: number
): number {
  if (workingDays === 0) return 0;
  return Math.round(totalMinutes / workingDays);
}

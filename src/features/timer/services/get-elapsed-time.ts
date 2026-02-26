export function getElapsedTime(timerStartedAt: string | null): number {
  if (!timerStartedAt) return 0;
  return Math.max(0, Date.now() - new Date(timerStartedAt).getTime());
}

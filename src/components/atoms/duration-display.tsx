"use client";

import { formatDuration } from "@/lib/date-utils";

interface DurationDisplayProps {
  minutes: number;
  className?: string;
}

export function DurationDisplay({ minutes, className }: DurationDisplayProps) {
  return <span className={className}>{formatDuration(minutes)}</span>;
}

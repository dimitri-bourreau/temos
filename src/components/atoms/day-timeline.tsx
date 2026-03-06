import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDuration } from "@/lib/date-utils";

const DAY_START_MIN = 6 * 60;
const DAY_END_MIN = 20 * 60;
const DAY_RANGE = DAY_END_MIN - DAY_START_MIN;
const HOUR_LABELS = [6, 8, 10, 12, 14, 16, 18, 20];

export interface TimeSegment {
  startMin: number;
  endMin: number;
  color: string;
  active?: boolean;
  tooltip?: {
    label: string;
    start: string;
    end: string;
    duration: string;
  };
}

interface DayTimelineProps {
  segments: TimeSegment[];
}

export function DayTimeline({ segments }: DayTimelineProps) {
  return (
    <div className="space-y-1">
      <div className="relative h-5 rounded bg-muted overflow-hidden">
        {segments.map((seg, i) => {
          const clampedStart = Math.max(seg.startMin, DAY_START_MIN);
          const clampedEnd = Math.min(seg.endMin, DAY_END_MIN);
          if (clampedEnd <= clampedStart) return null;

          const left = ((clampedStart - DAY_START_MIN) / DAY_RANGE) * 100;
          const width = ((clampedEnd - clampedStart) / DAY_RANGE) * 100;

          const style = {
            left: `${left}%`,
            width: `${width}%`,
            backgroundColor: seg.color,
            opacity: seg.active ? 0.6 : 1,
          };

          if (!seg.tooltip) {
            return <div key={i} className="absolute top-0 h-full" style={style} />;
          }

          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="absolute top-0 h-full cursor-default" style={style} />
              </TooltipTrigger>
              <TooltipContent side="top" className="space-y-0.5">
                <p className="font-semibold">{seg.tooltip.label}</p>
                <p>
                  {seg.tooltip.start} → {seg.tooltip.end}
                </p>
                <p className="opacity-70">{seg.tooltip.duration}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="relative h-3">
        {HOUR_LABELS.map((h) => {
          const pos = ((h * 60 - DAY_START_MIN) / DAY_RANGE) * 100;
          return (
            <span
              key={h}
              className="absolute text-[9px] text-muted-foreground -translate-x-1/2 leading-none"
              style={{ left: `${pos}%` }}
            >
              {h}h
            </span>
          );
        })}
      </div>
    </div>
  );
}

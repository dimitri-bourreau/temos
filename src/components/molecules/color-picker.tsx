"use client";

import { PASTEL_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PASTEL_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
            value === color ? "border-foreground scale-110" : "border-transparent"
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

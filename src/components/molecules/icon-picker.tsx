"use client";

import { CATEGORY_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

function getIcon(name: string) {
  const pascalCase = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalCase] as React.ComponentType<{ className?: string }> | undefined;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_ICONS.map((iconName) => {
        const Icon = getIcon(iconName);
        if (!Icon) return null;
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(iconName)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
              value === iconName
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

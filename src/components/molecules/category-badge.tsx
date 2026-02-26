"use client";

import { Badge } from "@/components/ui/badge";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { useCategoriesStore } from "@/features/categories/store";

interface CategoryBadgeProps {
  categoryId: string;
}

export function CategoryBadge({ categoryId }: CategoryBadgeProps) {
  const categories = useCategoriesStore((s) => s.categories);
  const category = categories.find((c) => c.id === categoryId);

  if (!category) return null;

  return (
    <Badge variant="secondary" className="gap-1.5 font-normal">
      <ColorSwatch color={category.color} className="h-2.5 w-2.5" />
      {category.name}
    </Badge>
  );
}

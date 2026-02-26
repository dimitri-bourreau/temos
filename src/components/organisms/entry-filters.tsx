"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { useCategoriesStore } from "@/features/categories/store";
import { useTranslations } from "next-intl";

interface EntryFiltersProps {
  categoryFilter: string;
  onCategoryFilterChange: (categoryId: string) => void;
}

export function EntryFilters({
  categoryFilter,
  onCategoryFilterChange,
}: EntryFiltersProps) {
  const t = useTranslations("entries");
  const categories = useCategoriesStore((s) => s.categories);

  return (
    <div className="flex items-center gap-2">
      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t("filterByCategory")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allCategories")}</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              <div className="flex items-center gap-2">
                <ColorSwatch color={cat.color} className="h-3 w-3" />
                {cat.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

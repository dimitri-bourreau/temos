"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DateNavigationProps {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function DateNavigation({
  label,
  onPrevious,
  onNext,
  onToday,
}: DateNavigationProps) {
  const t = useTranslations("common");

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={onPrevious} className="h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onToday} className="h-8">
        {t("today")}
      </Button>
      <Button variant="outline" size="icon" onClick={onNext} className="h-8 w-8">
        <ChevronRight className="h-4 w-4" />
      </Button>
      <span className="ml-2 text-sm font-medium">{label}</span>
    </div>
  );
}

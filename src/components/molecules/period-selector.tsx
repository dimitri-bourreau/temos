"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import type { Period } from "@/types";

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const t = useTranslations("statistics");

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Period)}>
      <TabsList>
        <TabsTrigger value="day">{t("day")}</TabsTrigger>
        <TabsTrigger value="week">{t("week")}</TabsTrigger>
        <TabsTrigger value="month">{t("month")}</TabsTrigger>
        <TabsTrigger value="year">{t("year")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

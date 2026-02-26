"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettingsStore } from "@/features/settings/store";
import { useTranslations } from "next-intl";

const DAYS_FROM_MONDAY = [
  { key: "monday", index: 1 },
  { key: "tuesday", index: 2 },
  { key: "wednesday", index: 3 },
  { key: "thursday", index: 4 },
  { key: "friday", index: 5 },
  { key: "saturday", index: 6 },
  { key: "sunday", index: 0 },
] as const;

export function WorkScheduleForm() {
  const t = useTranslations("settings");
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);

  const handleTargetChange = (value: string) => {
    const hours = parseFloat(value);
    if (!isNaN(hours) && hours >= 0) {
      updateSettings({
        workSchedule: { ...settings.workSchedule, targetHoursPerDay: hours },
      });
    }
  };

  const toggleRestDay = (day: number) => {
    const restDays = settings.workSchedule.restDays.includes(day)
      ? settings.workSchedule.restDays.filter((d) => d !== day)
      : [...settings.workSchedule.restDays, day];
    updateSettings({
      workSchedule: { ...settings.workSchedule, restDays },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("workSchedule")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label>{t("targetHours")}</Label>
          <Input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={settings.workSchedule.targetHoursPerDay}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-32"
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("restDays")}</Label>
          <div className="flex flex-wrap gap-3">
            {DAYS_FROM_MONDAY.map(({ key, index }) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={settings.workSchedule.restDays.includes(index)}
                  onCheckedChange={() => toggleRestDay(index)}
                />
                {t(`days.${key}`)}
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

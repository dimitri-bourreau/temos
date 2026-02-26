"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettingsStore } from "@/features/settings/store";
import { useTranslations } from "next-intl";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("workSchedule")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
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
        <div className="space-y-2">
          <Label>{t("restDays")}</Label>
          <div className="flex flex-wrap gap-3">
            {DAY_KEYS.map((dayKey, index) => (
              <label
                key={dayKey}
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={settings.workSchedule.restDays.includes(index)}
                  onCheckedChange={() => toggleRestDay(index)}
                />
                {t(`days.${dayKey}`)}
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

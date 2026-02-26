"use client";

import { AppShell } from "@/components/templates/app-shell";
import { WorkScheduleForm } from "@/components/organisms/work-schedule-form";
import { DataManager } from "@/components/organisms/data-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/features/settings/store";
import { resolveAndSetLocaleCookie } from "@/features/settings/services/set-locale-cookie";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);

  const switchLocale = async (locale: "en" | "fr" | "system") => {
    await updateSettings({ locale });
    resolveAndSetLocaleCookie(locale);
    router.refresh();
  };

  const switchTheme = async (newTheme: "light" | "dark" | "system") => {
    await updateSettings({ theme: newTheme });
    setTheme(newTheme);
  };

  const themeOptions = [
    { value: "light" as const, label: t("themeLight"), icon: Sun },
    { value: "dark" as const, label: t("themeDark"), icon: Moon },
    { value: "system" as const, label: t("themeSystem"), icon: Monitor },
  ];

  const localeOptions = [
    { value: "en" as const, label: t("english") },
    { value: "fr" as const, label: t("french") },
    { value: "system" as const, label: t("systemLanguage") },
  ];

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WorkScheduleForm />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("appearance")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>{t("theme")}</Label>
                <div className="flex gap-2">
                  {themeOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={theme === opt.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => switchTheme(opt.value)}
                      className="gap-2"
                    >
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t("language")}</Label>
                <div className="flex gap-2">
                  {localeOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={settings.locale === opt.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => switchLocale(opt.value)}
                      className="gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <DataManager />
        </div>
      </div>
    </AppShell>
  );
}

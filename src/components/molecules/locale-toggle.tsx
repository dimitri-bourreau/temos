"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { resolveAndSetLocaleCookie } from "@/features/settings/services/set-locale-cookie";

export function LocaleToggle() {
  const router = useRouter();
  const t = useTranslations("settings");

  const switchLocale = (locale: "en" | "fr" | "system") => {
    resolveAndSetLocaleCookie(locale);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale("en")}>
          {t("english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale("fr")}>
          {t("french")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale("system")}>
          {t("systemLanguage")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

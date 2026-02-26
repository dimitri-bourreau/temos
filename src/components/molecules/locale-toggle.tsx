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

function setLocaleCookie(locale: string) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`;
}

export function LocaleToggle() {
  const router = useRouter();
  const t = useTranslations("settings");

  const switchLocale = (locale: string) => {
    if (locale === "system") {
      const browserLang = navigator.language.toLowerCase();
      const resolved = browserLang.startsWith("fr") ? "fr" : "en";
      setLocaleCookie(resolved);
    } else {
      setLocaleCookie(locale);
    }
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

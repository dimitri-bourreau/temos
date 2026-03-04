import { fr } from "date-fns/locale/fr";
import { enUS } from "date-fns/locale/en-US";
import type { Locale } from "date-fns";

const localeMap: Record<string, Locale> = {
  fr,
  en: enUS,
};

export function getDateFnsLocale(locale: string): Locale {
  return localeMap[locale] ?? enUS;
}

import type { SupportedLocale } from "../../../../i18n/supported-locales";

export function setLocaleCookie(locale: SupportedLocale) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`;
}

export function resolveAndSetLocaleCookie(
  locale: "en" | "fr" | "system"
): void {
  if (locale === "system") {
    const browserLang = navigator.language.toLowerCase();
    const resolved: SupportedLocale = browserLang.startsWith("fr")
      ? "fr"
      : "en";
    setLocaleCookie(resolved);
  } else {
    setLocaleCookie(locale);
  }
}

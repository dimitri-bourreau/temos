import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { type SupportedLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./supported-locales";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value;
  const locale: SupportedLocale =
    raw && SUPPORTED_LOCALES.includes(raw as SupportedLocale)
      ? (raw as SupportedLocale)
      : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./traductions/${locale}.json`)).default,
  };
});

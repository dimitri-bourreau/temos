import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const validLocale = locale === "fr" ? "fr" : "en";

  return {
    locale: validLocale,
    messages: (await import(`./traductions/${validLocale}.json`)).default,
  };
});

"use client";

import { useEffect, useState } from "react";

export function useOsLocale(): "en" | "fr" {
  const [locale, setLocale] = useState<"en" | "fr">("en");

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    setLocale(browserLang.startsWith("fr") ? "fr" : "en");
  }, []);

  return locale;
}

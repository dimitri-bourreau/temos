import { NextRequest, NextResponse } from "next/server";
import { resolveLocale } from "../i18n/supported-locales";

export function middleware(request: NextRequest) {
  const localeCookie = request.cookies.get("locale");
  if (localeCookie) return NextResponse.next();

  const acceptLanguage = request.headers.get("accept-language");
  const locale = resolveLocale(acceptLanguage);

  const response = NextResponse.next();
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 31536000,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

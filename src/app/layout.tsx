import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://temos.app",
  ),
  title: {
    default: "Temos — Personal Time Tracking",
    template: "%s | Temos",
  },
  description:
    "Track your time effortlessly with Temos, a local-first personal time tracking app. No account needed — all data stays on your device.",
  keywords: [
    "time tracking",
    "productivity",
    "local-first",
    "offline",
    "personal",
  ],
  authors: [{ name: "Temos" }],
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Temos — Personal Time Tracking",
    description:
      "Track your time effortlessly. Local-first, no account needed — all data stays on your device.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Temos logo" }],
  },
  twitter: {
    card: "summary",
    title: "Temos — Personal Time Tracking",
    description:
      "Track your time effortlessly. Local-first, no account needed.",
    images: ["/logo.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

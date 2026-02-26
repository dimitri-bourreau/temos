"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  ListTodo,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const navItems = [
  { href: "/", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/entries", icon: Clock, labelKey: "entries" as const },
  { href: "/tasks-and-categories", icon: ListTodo, labelKey: "tasksAndCategories" as const },
  { href: "/statistics", icon: BarChart3, labelKey: "statistics" as const },
  { href: "/settings", icon: Settings, labelKey: "settings" as const },
];

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background py-2 md:hidden">
      {navItems.slice(0, 5).map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-all duration-200",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon
              className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")}
            />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileSidebarContent() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Image
          src="/logo.jpg"
          alt="Temos"
          width={32}
          height={32}
          className="size-8 mix-blend-multiply dark:mix-blend-screen rounded-md"
        />
        <span className="text-lg font-semibold text-sidebar-foreground">
          Temos
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-0.5"
              )}
            >
              <item.icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

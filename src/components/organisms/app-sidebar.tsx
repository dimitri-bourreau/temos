"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  ListTodo,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { LocaleToggle } from "@/components/molecules/locale-toggle";

const navItems = [
  { href: "/", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/entries", icon: Clock, labelKey: "entries" as const },
  { href: "/tasks-and-categories", icon: ListTodo, labelKey: "tasksAndCategories" as const },
];

const settingsItem = {
  href: "/settings",
  icon: Settings,
  labelKey: "settings" as const,
};

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-border bg-linear-to-r from-sidebar to-sidebar-accent/30 px-6">
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
      <nav className="flex flex-1 flex-col p-3">
        <div className="space-y-1">
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
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-0.5",
                )}
              >
                <item.icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto flex items-center gap-1">
          <Link
            href={settingsItem.href}
            className={cn(
              "flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname.startsWith(settingsItem.href)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-0.5",
            )}
          >
            <settingsItem.icon className="h-4 w-4" />
            {t(settingsItem.labelKey)}
          </Link>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </nav>
    </aside>
  );
}

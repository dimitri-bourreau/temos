"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Tag,
  BarChart3,
  Settings,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const navItems = [
  { href: "/", icon: LayoutDashboard, labelKey: "dashboard" as const },
  { href: "/calendar", icon: Calendar, labelKey: "calendar" as const },
  { href: "/entries", icon: Clock, labelKey: "entries" as const },
  { href: "/categories", icon: Tag, labelKey: "categories" as const },
  { href: "/statistics", icon: BarChart3, labelKey: "statistics" as const },
  { href: "/settings", icon: Settings, labelKey: "settings" as const },
];

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Timer className="h-6 w-6 text-primary" />
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

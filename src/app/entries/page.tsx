"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/templates/app-shell";
import { EntryList } from "@/components/organisms/entry-list";
import { EntryFilters } from "@/components/organisms/entry-filters";
import { TodayNotes } from "@/components/organisms/today-notes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EntriesPage() {
  const t = useTranslations("entries");
  const [categoryFilter, setCategoryFilter] = useState("all");

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Button asChild>
            <Link href="/entries/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("new")}
            </Link>
          </Button>
        </div>
        <EntryFilters
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
        />
        <TodayNotes />
        <EntryList categoryFilter={categoryFilter === "all" ? undefined : categoryFilter} />
      </div>
    </AppShell>
  );
}

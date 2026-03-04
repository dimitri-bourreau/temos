"use client";

import { AppSidebar } from "@/components/organisms/app-sidebar";
import { MobileHeader } from "@/components/organisms/mobile-header";
import { MobileNav } from "@/components/organisms/mobile-nav";
import { FloatingTimerBar } from "@/components/organisms/floating-timer-bar";
import { PageTransition } from "./page-transition";
import { useEffect } from "react";
import { useEntriesStore } from "@/features/entries/store";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { useSettingsStore } from "@/features/settings/store";
import { useHydration } from "@/hooks/use-hydration";

export function AppShell({ children }: { children: React.ReactNode }) {
  const hydrated = useHydration();
  const loadEntries = useEntriesStore((s) => s.load);
  const loadCategories = useCategoriesStore((s) => s.load);
  const loadTasks = useTasksStore((s) => s.load);
  const loadSettings = useSettingsStore((s) => s.load);
  const entriesLoaded = useEntriesStore((s) => s.loaded);
  const categoriesLoaded = useCategoriesStore((s) => s.loaded);
  const tasksLoaded = useTasksStore((s) => s.loaded);
  const settingsLoaded = useSettingsStore((s) => s.loaded);

  useEffect(() => {
    if (hydrated) {
      loadEntries();
      loadCategories();
      loadTasks();
      loadSettings();
    }
  }, [hydrated, loadEntries, loadCategories, loadTasks, loadSettings]);

  const isLoaded = entriesLoaded && categoriesLoaded && tasksLoaded && settingsLoaded;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {isLoaded ? (
            <PageTransition>{children}</PageTransition>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
        </main>
        <FloatingTimerBar />
        <MobileNav />
      </div>
    </div>
  );
}

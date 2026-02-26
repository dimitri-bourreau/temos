"use client";

import { AppShell } from "@/components/templates/app-shell";
import { TaskList } from "@/components/organisms/task-list";
import { useTranslations } from "next-intl";

export default function TasksPage() {
  const t = useTranslations("tasks");

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <TaskList />
      </div>
    </AppShell>
  );
}

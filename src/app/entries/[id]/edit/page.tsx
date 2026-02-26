"use client";

import { use } from "react";
import { AppShell } from "@/components/templates/app-shell";
import { EntryForm } from "@/components/organisms/entry-form";
import { useEntriesStore } from "@/features/entries/store";

export default function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const entries = useEntriesStore((s) => s.entries);
  const entry = entries.find((e) => e.id === id);

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <EntryForm entry={entry} />
      </div>
    </AppShell>
  );
}

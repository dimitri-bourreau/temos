"use client";

import { AppShell } from "@/components/templates/app-shell";
import { EntryForm } from "@/components/organisms/entry-form";

export default function NewEntryPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <EntryForm />
      </div>
    </AppShell>
  );
}

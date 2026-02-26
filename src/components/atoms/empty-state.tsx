"use client";

import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        {icon || <Inbox className="h-8 w-8 text-muted-foreground" />}
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";

interface TimerStartTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startedAt: string | null;
  onSave: (newStartedAt: string) => void;
}

export function TimerStartTimeDialog({
  open,
  onOpenChange,
  startedAt,
  onSave,
}: TimerStartTimeDialogProps) {
  const t = useTranslations("timer");
  const tCommon = useTranslations("common");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (open && startedAt) {
      setTime(format(parseISO(startedAt), "HH:mm"));
    }
  }, [open, startedAt]);

  const handleSave = () => {
    if (!startedAt || !time) return;
    const date = format(parseISO(startedAt), "yyyy-MM-dd");
    const newStartedAt = new Date(`${date}T${time}`).toISOString();
    onSave(newStartedAt);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>{t("editStartTime")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label>{t("startTime")}</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleSave}>{tCommon("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

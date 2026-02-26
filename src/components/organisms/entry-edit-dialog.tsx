"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorSwatch } from "@/components/atoms/color-swatch";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { useEntriesStore } from "@/features/entries/store";
import { useTranslations } from "next-intl";
import type { TimeEntry, Task } from "@/types";
import { format, parseISO } from "date-fns";

interface EntryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: TimeEntry | null;
}

export function EntryEditDialog({
  open,
  onOpenChange,
  entry,
}: EntryEditDialogProps) {
  const t = useTranslations("entries");
  const tCommon = useTranslations("common");
  const categories = useCategoriesStore((s) => s.categories);
  const tasks = useTasksStore((s) => s.tasks);
  const updateEntry = useEntriesStore((s) => s.update);
  const removeEntry = useEntriesStore((s) => s.remove);

  const [taskId, setTaskId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tasksByCategory = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.categoryId]) map[task.categoryId] = [];
      map[task.categoryId].push(task);
    }
    return map;
  }, [tasks]);

  useEffect(() => {
    if (entry) {
      setTaskId(entry.taskId ?? "");
      setNote(entry.description);
      setDate(format(parseISO(entry.startTime), "yyyy-MM-dd"));
      setStartTime(format(parseISO(entry.startTime), "HH:mm"));
      setEndTime(format(parseISO(entry.endTime), "HH:mm"));
    }
  }, [entry, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    const selectedTask = tasks.find((t) => t.id === taskId);
    const categoryId = selectedTask?.categoryId ?? entry.categoryId;

    const startISO = new Date(`${date}T${startTime}`).toISOString();
    const endISO = new Date(`${date}T${endTime}`).toISOString();

    await updateEntry(entry.id, {
      categoryId,
      taskId: taskId || undefined,
      description: note,
      startTime: startISO,
      endTime: endISO,
    });
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!entry) return;
    await removeEntry(entry.id);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t("edit")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t("task")}</Label>
                <Select value={taskId} onValueChange={setTaskId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const catTasks = tasksByCategory[cat.id];
                      if (!catTasks?.length) return null;
                      return (
                        <SelectGroup key={cat.id}>
                          <SelectLabel>
                            <div className="flex items-center gap-2">
                              <ColorSwatch
                                color={cat.color}
                                className="h-3 w-3"
                              />
                              {cat.name}
                            </div>
                          </SelectLabel>
                          {catTasks.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("note")}</Label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("notePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("date")}</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("startTime")}</Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("endTime")}</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                {tCommon("delete")}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {tCommon("cancel")}
                </Button>
                <Button type="submit">{tCommon("save")}</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={tCommon("delete")}
        description={t("deleteConfirm")}
        onConfirm={handleDelete}
      />
    </>
  );
}

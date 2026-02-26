"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Play, Plus, Square, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { TaskForm } from "@/components/organisms/task-form";
import { CategoryForm } from "@/components/organisms/category-form";
import { useCategoriesStore } from "@/features/categories/store";
import { useTasksStore } from "@/features/tasks/store";
import { useTimer } from "@/features/timer/hook";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/atoms/empty-state";
import type { Category, Task } from "@/types";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

function getIcon(name: string) {
  const pascalCase = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalCase] as
    | React.ComponentType<{ className?: string; style?: React.CSSProperties }>
    | undefined;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function TaskList() {
  const t = useTranslations("tasks");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");
  const categories = useCategoriesStore((s) => s.categories);
  const addCategory = useCategoriesStore((s) => s.add);
  const updateCategory = useCategoriesStore((s) => s.update);
  const removeCategory = useCategoriesStore((s) => s.remove);
  const tasks = useTasksStore((s) => s.tasks);
  const addTask = useTasksStore((s) => s.add);
  const updateTask = useTasksStore((s) => s.update);
  const removeTask = useTasksStore((s) => s.remove);
  const { isRunning, elapsed, taskId: runningTaskId, start, stop } = useTimer();

  // Task form state
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<string | null>(null);

  // Category form state
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<string | null>(null);

  const tasksByCategory = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!map[task.categoryId]) map[task.categoryId] = [];
      map[task.categoryId].push(task);
    }
    return map;
  }, [tasks]);

  // Task handlers
  const handleAddTask = (categoryId: string) => {
    setEditingTask(null);
    setActiveCategoryId(categoryId);
    setTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setActiveCategoryId(task.categoryId);
    setTaskFormOpen(true);
  };

  const handleTaskSubmit = async (data: { name: string }) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else if (activeCategoryId) {
      await addTask({ categoryId: activeCategoryId, name: data.name });
    }
  };

  // Category handlers
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (data: {
    name: string;
    color: string;
    icon: string;
  }) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await addCategory(data);
    }
    setEditingCategory(null);
  };

  const handleTimerToggle = async (task: Task) => {
    if (isRunning && runningTaskId === task.id) {
      await stop();
    } else {
      if (isRunning) await stop();
      await start(task.categoryId, task.id);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingCategory(null);
            setCategoryFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {tCat("new")}
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState message={t("noCategories")} />
      ) : (
        <div className="mt-4 space-y-6">
          {categories.map((category, index) => {
            const Icon = getIcon(category.icon);
            const categoryTasks = tasksByCategory[category.id] || [];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{ backgroundColor: category.color + "30" }}
                        >
                          {Icon && (
                            <Icon
                              className="h-5 w-5"
                              style={{ color: category.color }}
                            />
                          )}
                        </div>
                        <CardTitle className="text-base">
                          {category.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setDeleteCategoryTarget(category.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddTask(category.id)}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          {t("new")}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {categoryTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t("noTasks")}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {categoryTasks.map((task) => {
                          const isThisTaskRunning =
                            isRunning && runningTaskId === task.id;

                          return (
                            <div
                              key={task.id}
                              className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                                isThisTaskRunning
                                  ? "border-primary/50 bg-primary/5"
                                  : "hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">
                                  {task.name}
                                </span>
                                {isThisTaskRunning && (
                                  <span className="animate-pulse font-mono text-xs text-primary">
                                    {formatElapsed(elapsed)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant={
                                    isThisTaskRunning
                                      ? "destructive"
                                      : "outline"
                                  }
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleTimerToggle(task)}
                                  title={
                                    isThisTaskRunning
                                      ? t("timerRunning")
                                      : t("startTimer")
                                  }
                                >
                                  {isThisTaskRunning ? (
                                    <Square className="h-3.5 w-3.5" />
                                  ) : (
                                    <Play className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditTask(task)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => setDeleteTaskTarget(task.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />

      <CategoryForm
        open={categoryFormOpen}
        onOpenChange={(open) => {
          setCategoryFormOpen(open);
          if (!open) setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        category={editingCategory}
      />

      <ConfirmDialog
        open={deleteTaskTarget !== null}
        onOpenChange={() => setDeleteTaskTarget(null)}
        title={tCommon("delete")}
        description={t("deleteConfirm")}
        onConfirm={() => {
          if (deleteTaskTarget) removeTask(deleteTaskTarget);
        }}
      />

      <ConfirmDialog
        open={deleteCategoryTarget !== null}
        onOpenChange={() => setDeleteCategoryTarget(null)}
        title={tCommon("delete")}
        description={tCat("deleteConfirm")}
        onConfirm={() => {
          if (deleteCategoryTarget) removeCategory(deleteCategoryTarget);
        }}
      />
    </>
  );
}

"use client";

import { create } from "zustand";
import type { Task } from "@/types";
import { db } from "@/db";
import { createTask } from "./services/create-task";
import { updateTask } from "./services/update-task";
import { deleteTask } from "./services/delete-task";
import { getTasks } from "./services/get-tasks";

interface TasksState {
  tasks: Task[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task>;
  update: (id: string, updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  replaceAll: (tasks: Task[]) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  loaded: false,

  load: async () => {
    const tasks = await getTasks(db);
    set({ tasks, loaded: true });
  },

  add: async (data) => {
    const task = await createTask(db, data);
    set((state) => ({ tasks: [...state.tasks, task] }));
    return task;
  },

  update: async (id, updates) => {
    const updated = await updateTask(db, id, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },

  remove: async (id) => {
    await deleteTask(db, id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  replaceAll: (tasks) => set({ tasks }),
}));

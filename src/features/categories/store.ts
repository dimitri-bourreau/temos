"use client";

import { create } from "zustand";
import type { Category } from "@/types";
import { db } from "@/db";
import { createCategory } from "./services/create-category";
import { updateCategory } from "./services/update-category";
import { deleteCategory } from "./services/delete-category";
import { seedDefaultCategories } from "./services/seed-default-categories";

interface CategoriesState {
  categories: Category[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (data: Omit<Category, "id" | "createdAt" | "updatedAt">) => Promise<Category>;
  update: (id: string, updates: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  replaceAll: (categories: Category[]) => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loaded: false,

  load: async () => {
    const categories = await seedDefaultCategories(db);
    set({ categories, loaded: true });
  },

  add: async (data) => {
    const category = await createCategory(db, data);
    set((state) => ({ categories: [...state.categories, category] }));
    return category;
  },

  update: async (id, updates) => {
    const updated = await updateCategory(db, id, updates);
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? updated : c)),
    }));
  },

  remove: async (id) => {
    await deleteCategory(db, id);
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },

  replaceAll: (categories) => set({ categories }),
}));
